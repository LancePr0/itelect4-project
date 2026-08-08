// src/components/StatusBadge.tsx -- REPLACE the whole file
import React from "react";
import { ComplaintStatus } from "../types/index";

interface StatusBadgeProps {
    statusType: ComplaintStatus;
    variant?: "default" | "compact"; // <-- NEW: the optional variant prop
    children?: React.ReactNode;
}

const STATUS_STYLES: Record<ComplaintStatus, string> = {
    [ComplaintStatus.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    [ComplaintStatus.RESOLVED]: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    [ComplaintStatus.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, variant = "default", children }) => {
    const isCompact = variant === "compact";

    return (
        <div
            className={`inline-flex items-center rounded-full font-semibold ${STATUS_STYLES[statusType]} ${
                isCompact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
            }`}
        >
            {!isCompact && <strong className="mr-1">Status:</strong>}{/* <-- NEW: compact hides the label */}
            {statusType}
            {children}
        </div>
    );
};

export default StatusBadge;
