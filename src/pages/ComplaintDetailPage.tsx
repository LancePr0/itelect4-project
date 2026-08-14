// src/pages/ComplaintDetailPage.tsx
import { useParams, useNavigate } from "react-router";
import { MOCK_COMPLAINTS } from "../data/mockData";
import ComplaintCard from "../components/ComplaintCard";

function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const complaint = MOCK_COMPLAINTS.find((c) => c.id === id);

  if (complaint === undefined) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        No complaint found with id "{id}".
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {complaint.complaint_number}
      </h2>

      <div className="max-w-sm">
        <ComplaintCard complaint={complaint} />
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
