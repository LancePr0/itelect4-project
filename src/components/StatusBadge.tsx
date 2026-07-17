// src/components/StatusBadge.tsx
import React from "react";
import { ComplaintStatus } from "../types/index"; // Import your enum

interface StatusBadgeProps {
    statusType: ComplaintStatus; // Use the official project enum here!
    children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, children }) => {
    return (
        <div className={`status-badge status-${statusType.toLowerCase()}`}>
            <strong>Status: </strong>
            {statusType}
            {children}
        </div>
    );
};

export default StatusBadge;