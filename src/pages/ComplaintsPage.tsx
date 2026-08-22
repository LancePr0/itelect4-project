// src/pages/ComplaintsPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Complaint } from "../api/client";
import { fetchComplaints, createComplaint } from "../api/client";
import ComplaintCard from "../components/ComplaintCard";
import usePrevious from "../hooks/usePrevious";
import useToggle from "../hooks/useToggle";
import useUiStore from "../store/uiStore";

function ComplaintsPage() {
  const queryClient = useQueryClient();

  // 1. READ
  const { data, isPending, isError, error } = useQuery<Complaint[]>({
    queryKey: ["complaints"],
    queryFn: fetchComplaints,
  });

  // The search box reads and writes the store, not local state
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);
  const [showDetails, toggleDetails] = useToggle(false);

  // The new-complaint form. Local, because only this one form reads it.
  const [complainantName, setComplainantName] = useState<string>("");
  const [violationType, setViolationType] = useState<string>("");
  const [tricycleBody, setTricycleBody] = useState<string>("");

  // 2. WRITE -- mutationFn does the POST, onSuccess cleans up after it
  const addComplaint = useMutation({
    mutationFn: createComplaint,
    onSuccess: () => {
      // "the complaints list is out of date now -- go and refetch it"
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      setComplainantName("");
      setViolationType("");
      setTricycleBody("");
    },
  });

  const handleFile = (): void => {
    addComplaint.mutate({
      complaint_number: `CMP-${Date.now()}`,
      complainant_name: complainantName,
      tricycle_body_number: tricycleBody,
      violation_type: violationType,
      status: "Pending",
      created_at: new Date().toISOString(),
    });
  };

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400">
        Loading complaints...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  const filteredComplaints = data.filter(
    (c) =>
      c.violation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canFile =
    complainantName !== "" && violationType !== "" && tricycleBody !== "";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complaints
        </h2>
        <button
          onClick={toggleDetails}
          className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          {showDetails ? "Hide Extra Details" : "Show Extra Details"}
        </button>
      </div>

      {/* File a new complaint -- POST /complaints, then invalidate the list */}
      <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          value={complainantName}
          onChange={(e) => setComplainantName(e.target.value)}
          placeholder="Complainant name"
          className="rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <input
          value={violationType}
          onChange={(e) => setViolationType(e.target.value)}
          placeholder="Violation"
          className="rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <div className="flex gap-2">
          <input
            value={tricycleBody}
            onChange={(e) => setTricycleBody(e.target.value)}
            placeholder="Tricycle body #"
            className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleFile}
            disabled={!canFile || addComplaint.isPending}
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
          >
            {addComplaint.isPending ? "Filing..." : "File"}
          </button>
        </div>
      </div>
      {addComplaint.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addComplaint.error.message}
        </p>
      )}

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search complaints..."
        className="mt-4 w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />

      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
          Previous search: "{previousSearch}"
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredComplaints.length === 0 ? (
          <p className="col-span-full text-gray-500 dark:text-gray-400">
            No complaints found.
          </p>
        ) : (
          filteredComplaints.map((item) => (
            <Link key={item.id} to={`/complaints/${item.id}`}>
              <ComplaintCard
                complaint={item}
                variant={showDetails ? "default" : "compact"}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ComplaintsPage;
