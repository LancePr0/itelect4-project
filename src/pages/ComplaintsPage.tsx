// src/pages/ComplaintsPage.tsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import type { Complaint } from "../data/mockData";
import { MOCK_COMPLAINTS } from "../data/mockData";
import ComplaintCard from "../components/ComplaintCard";
import usePrevious from "../hooks/usePrevious";
import useToggle from "../hooks/useToggle";

function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);
  const [showDetails, toggleDetails] = useToggle(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplaints(MOCK_COMPLAINTS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(e.target.value);
  };

  const filteredComplaints = complaints.filter(
    (c) =>
      c.violation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400">
        Loading complaints...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        Could not load complaints. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Complaints
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsError(true)}
            className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 transition hover:bg-red-200"
          >
            Simulate Error
          </button>
          <button
            onClick={toggleDetails}
            className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {showDetails ? "Hide Extra Details" : "Show Extra Details"}
          </button>
        </div>
      </div>

      <input
        ref={searchInputRef}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search complaints..."
        className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
