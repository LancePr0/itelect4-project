// src/components/ComplaintCard.tsx
import type { Complaint } from "../App";
import StatusBadge from "./StatusBadge";

interface ComplaintCardProps {
    complaint: Complaint;
    variant?: "default" | "compact"; // optional variant prop
}

function ComplaintCard({ complaint, variant = "default" }: ComplaintCardProps) {
    const isCompact = variant === "compact";

    return (
        <div
            className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 ${
                isCompact ? "p-3" : "p-5"
            }`}
        >
            <div className="flex items-center justify-between">
                <h3
                    className={`font-bold text-gray-900 dark:text-white ${
                        isCompact ? "text-sm" : "text-lg"
                    }`}
                >
                    {complaint.complaint_number}
                </h3>
                <StatusBadge statusType={complaint.status} variant="compact" />
            </div>

            {/* Compact view hides extra info */}
            {!isCompact && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Complainant: {complaint.complainant_name}
                </p>
            )}

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Violation: {complaint.violation_type} — Body #{complaint.tricycle_body_number}
            </p>
        </div>
    );
}

export default ComplaintCard;
