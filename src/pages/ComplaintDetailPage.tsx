// src/pages/ComplaintDetailPage.tsx
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import type { Complaint } from "../api/client";
import { fetchComplaintById } from "../api/client";
import ComplaintCard from "../components/ComplaintCard";

function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // The id from the URL goes INTO the key, so each complaint gets its
  // own cache entry instead of every one sharing a single box.
  const { data, isPending, isError, error } = useQuery<Complaint>({
    queryKey: ["complaints", id],
    queryFn: () => fetchComplaintById(id!),
    enabled: id !== undefined,
  });

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400">
        Loading complaint...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {data.complaint_number}
      </h2>

      <div className="max-w-sm">
        <ComplaintCard complaint={data} />
      </div>

      <button
        onClick={() => navigate("/complaints")}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Back to Complaints
      </button>
    </div>
  );
}

export default ComplaintDetailPage;
