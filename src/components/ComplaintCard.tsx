// src/components/ComplaintCard.tsx
import type { ApiComplaint } from "../types/index";
import StatusBadge from "./StatusBadge";

interface ComplaintCardProps {
    complaint: ApiComplaint;
    // The card never fetches a tricycle itself -- tricycleId is a Mongo
    // id, not a plate number, and the parent already has the tricycle
    // list loaded for the form's dropdown. Passing the plate in avoids
    // every card re-fetching the same three rows.
    tricyclePlate?: string;
    variant?: "default" | "compact";
}

function ComplaintCard({ complaint, tricyclePlate, variant = "default" }: ComplaintCardProps) {
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
                    {complaint.complainantName}
                </h3>
                <StatusBadge statusType={complaint.status} variant="compact" />
            </div>

            {/* Compact view hides extra info */}
            {!isCompact && (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {complaint.issueDescription}
                </p>
            )}

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tricycle: {tricyclePlate ?? complaint.tricycleId}
            </p>
        </div>
    );
}

export default ComplaintCard;
