import { useState, useEffect, useRef } from "react";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";


interface Complaint {
  id: string;
  complaint_number: string;
  complainant_name: string;
  tricycle_body_number: string;
  violation_type: string;
  status: "Pending" | "Under Review" | "Resolved";
  created_at: string;
}


const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    complaint_number: "CMP-2026-001",
    complainant_name: "Juan Dela Cruz",
    tricycle_body_number: "123",
    violation_type: "Overcharging",
    status: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    complaint_number: "CMP-2026-002",
    complainant_name: "Maria Santos",
    tricycle_body_number: "456",
    violation_type: "Refusal to Convey Passenger",
    status: "Under Review",
    created_at: new Date().toISOString(),
  },
];

export function App() {
 
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  
  const searchInputRef = useRef<HTMLInputElement>(null);

  
  const [showDetails, toggleDetails] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  
  const focusSearch = (): void => {
    searchInputRef.current?.focus();
  };


  useEffect(() => {
    async function fetchComplaints() {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setComplaints(MOCK_COMPLAINTS);
      } catch (err: any) {
        setError("Failed to load complaints.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchComplaints();
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

  if (isLoading) return <p className="p-4 text-gray-500">Loading complaint records...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

 
  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      {/* Search Input & Focus Button */}
      <div className="flex gap-2">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          placeholder="Search complaints..."
          onChange={handleSearchChange}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={focusSearch}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium"
        >
          Focus
        </button>
      </div>

      {/* Previous Search Indicator (usePrevious hook) */}
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="text-xs text-gray-500 italic">
          Previous search: "{previousSearch}"
        </p>
      )}

      {/* Details Toggle Button (useToggle hook) */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tricycle Complaint Records</h2>
        <button
          onClick={toggleDetails}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-semibold"
        >
          {showDetails ? "Hide Extra Details" : "Show Extra Details"}
        </button>
      </div>

      {/* Complaints List */}
      {filteredComplaints.length === 0 ? (
        <p className="text-gray-500">No complaints found.</p>
      ) : (
        filteredComplaints.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{item.complaint_number}</span>
              <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                {item.status}
              </span>
            </div>
            
            <p className="text-sm mt-1">
              <strong>Violation:</strong> {item.violation_type}
            </p>

            {/* Conditionally visible content based on useToggle */}
            {showDetails && (
              <div className="mt-2 text-xs text-gray-600 border-t pt-2 space-y-1">
                <p><strong>Complainant:</strong> {item.complainant_name}</p>
                <p><strong>Body #:</strong> {item.tricycle_body_number}</p>
                <p><strong>Date Reported:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;