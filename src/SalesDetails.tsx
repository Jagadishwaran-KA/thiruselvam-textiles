import { useState } from "react";
import { usePOSContext } from "./POSContext";

interface SalesDetailsProps {
  onBack: () => void;
}

export default function SalesDetails({ onBack }: SalesDetailsProps) {
  const { bills } = usePOSContext();
  const [searchId, setSearchId] = useState("");
  const [filteredBills, setFilteredBills] = useState(bills);

  const handleSearch = () => {
    if (searchId) {
      setFilteredBills(
        bills.filter((bill) =>
          bill.id.toLowerCase().includes(searchId.toLowerCase())
        )
      );
    } else {
      setFilteredBills(bills);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4">Sales Details</h2>
      <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Bill ID"
          className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Search
        </button>
      </div>
      <div className="overflow-x-auto flex-grow">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bill ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {bill.items.map((item, index) => (
                          <li key={index} className="truncate">
                            {item.name} - {item.quantity} x{" "}
                            {item.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <button
        onClick={onBack}
        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
      >
        Back to POS
      </button>
    </div>
  );
}
