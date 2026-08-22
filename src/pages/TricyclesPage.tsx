// src/pages/TricyclesPage.tsx
// Behind ProtectedRoute -- operator phone numbers only show to logged-in officers.
import { useQuery } from "@tanstack/react-query";
import type { ApiTricycle } from "../types/index";
import { fetchTricycles } from "../api/client";

function TricyclesPage() {
  const { data, isPending, isError, error } = useQuery<ApiTricycle[]>({
    queryKey: ["tricycles"],
    queryFn: fetchTricycles,
  });

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400">
        Loading tricycles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Registered Tricycles
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((t) => (
          <div
            key={t.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {t.plateNumber}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Operator: {t.operatorName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Phone: {t.phoneNumber}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TricyclesPage;
