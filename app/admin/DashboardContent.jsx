"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "../actions/auth";

function Dashboard({ data, setIsAuthenticated }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSignOut = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  const handleRead = async (id) => {
    console.log("ethy");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-14 bg-white h-16 px-3 rounded-md ">
        <h1 className="text-2xl font-bold">Shipment Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(data[0]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  {key}
                  {sortColumn === key && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {Object.entries(item).map(([key, value]) => (
                  <td
                    key={key}
                    onClick={() => {
                      key === "read" ? handleRead(value[1]) : "";
                    }}
                    className="px-4 py-2 cursor-pointer"
                  >
                    {key === "read"
                      ? value[0]
                        ? "Yes"
                        : "No"
                      : value.toString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="mr-2 text-white">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="text-white">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
