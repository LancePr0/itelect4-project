// src/components/StatusBadge.tsx
import React from "react";
import type { Complaint } from "../App";

type ComplaintStatus = Complaint["status"];

interface StatusBadgeProps {
    statusType: ComplaintStatus;
    variant?: "default" | "compact"; // <-- optional variant prop
    children?: React.ReactNode;
}

const STATUS_STYLES: Record<ComplaintStatus, string> = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    "Under Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Resolved: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, variant = "default", children }) => {
    const isCompact = variant === "compact";

    return (
        <div
            className={`inline-flex items-center rounded-full font-semibold ${STATUS_STYLES[statusType]} ${
                isCompact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
            }`}
        >
            {!isCompact && <strong className="mr-1">Status:</strong>}
            {statusType}
            {children}
        </div>
    );
};

export default StatusBadge;
