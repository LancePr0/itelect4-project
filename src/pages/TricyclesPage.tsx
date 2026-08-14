// src/pages/TricyclesPage.tsx
import { MOCK_TRICYCLES } from "../data/mockData";

function TricyclesPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Registered Tricycles
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_TRICYCLES.map((t) => (
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
