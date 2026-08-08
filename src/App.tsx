// src/App.tsx (final -- putting all 4 parts together)

import { useState, useEffect, useRef } from "react";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

// Type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface Complaint {
  id: string;
  complaint_number: string;
  complainant_name: string;
  tricycle_body_number: string;
  violation_type: string;
  status: "Pending" | "Under Review" | "Resolved";
  created_at: string;
}

// Mock Data
const officerUser: User = {
  id: 1,
  name: "Officer Juan dela Cruz",
  email: "juan.delacruz@traffic.gov.ph",
  role: "Traffic Enforcer",
  isActive: true,
};

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    complaint_number: "CMP-2026-001",
    complainant_name: "Maria Santos",
    tricycle_body_number: "123",
    violation_type: "Overcharging",
    status: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    complaint_number: "CMP-2026-002",
    complainant_name: "Pedro Penduko",
    tricycle_body_number: "456",
    violation_type: "Refusal to Convey Passenger",
    status: "Under Review",
    created_at: new Date().toISOString(),
  },
];

export function App() {
  // ===== PART 2: STATE, REFS & CUSTOM HOOKS =====
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showDetails, toggleDetails] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  const focusSearch = (): void => {
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplaints(MOCK_COMPLAINTS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // ===== PART 3: HANDLERS, FILTER & EARLY RETURNS =====
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

  // Styled Loading State
  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading complaint records...
      </div>
    );
  }

  // Styled Error State
  if (isError) {
    return (
      <div className="m-6 rounded-lg bg-red-50 p-4 text-red-700">
        Could not load complaint records.
      </div>
    );
  }

  // ===== PART 4: JSX RENDER =====
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 p-6 text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
        {/* Controls: Dark mode toggle & Error simulation */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white transition hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => setIsError(true)}
              className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 transition"
            >
              Simulate Error
            </button>
          </div>

          <button
            onClick={toggleDetails}
            className="rounded bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {showDetails ? "Hide Extra Details" : "Show Extra Details"}
          </button>
        </div>

        {/* Search Bar with Focus */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search complaints..."
              className="w-full rounded border border-gray-300 p-2 text-sm bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={focusSearch}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Focus
            </button>
          </div>

          {previousSearch !== undefined && previousSearch !== searchTerm && (
            <p className="text-xs text-gray-500 italic dark:text-gray-400">
              Previous search: "{previousSearch}"
            </p>
          )}
        </div>

        {/* Selected User Indicator */}
        {selectedUser && (
          <p className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400">
            Selected Officer: {selectedUser.name}
          </p>
        )}

        {/* Responsive Grid Layout */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* User / Officer Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {officerUser.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {officerUser.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Role: {officerUser.role}
            </p>
            <button
              onClick={() => setSelectedUser(officerUser)}
              className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Select Officer
            </button>
          </div>

          {/* Dynamic Complaint Cards */}
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${
                showDetails ? "p-5" : "p-3"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`font-bold text-gray-900 dark:text-white ${
                    showDetails ? "text-lg" : "text-sm"
                  }`}
                >
                  {item.complaint_number}
                </h3>
                <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                  {item.status}
                </span>
              </div>

              {showDetails && (
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                  Complainant: {item.complainant_name}
                </p>
              )}

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Violation: {item.violation_type} — Body #{item.tricycle_body_number}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
