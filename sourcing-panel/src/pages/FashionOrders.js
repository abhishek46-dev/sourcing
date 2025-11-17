import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// All columns from the Excel (match exact names)
const columns = [
  "Sourcing Spoc", "Vendor Name", "Status Date", "Brand", "Article Type", "Gender", "Season",
  "Pantone Required", "Pantone Approved", "Pantone Pending", "Pantone %",
  "Print Required", "Print Approved", "Print Pending", "Print %",
  "PP Required", "PP Approved", "PP Pending", "PP %",
];

const tableData = [
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Krishna Apparel",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "T-Shirts",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 25,
    "Pantone Approved": 10,
    "Pantone Pending": 15,
    "Pantone %": 40.0,
    "Print Required": 400,
    "Print Approved": 200,
    "Print Pending": 200,
    "Print %": 50.0,
    "PP Required": 400,
    "PP Approved": 150,
    "PP Pending": 250,
    "PP %": 37.5,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Vishwa Apparel",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Sweatshirt",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 20,
    "Pantone Approved": 5,
    "Pantone Pending": 15,
    "Pantone %": 25.0,
    "Print Required": 100,
    "Print Approved": 25,
    "Print Pending": 75,
    "Print %": 25.0,
    "PP Required": 100,
    "PP Approved": 20,
    "PP Pending": 80,
    "PP %": 20.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Ganesh Garments",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Track pants",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 30,
    "Pantone Approved": 25,
    "Pantone Pending": 5,
    "Pantone %": 83.0,
    "Print Required": 200,
    "Print Approved": 150,
    "Print Pending": 50,
    "Print %": 75.0,
    "PP Required": 200,
    "PP Approved": 125,
    "PP Pending": 75,
    "PP %": 63.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Sonam Exports",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Tops",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 35,
    "Pantone Approved": 20,
    "Pantone Pending": 15,
    "Pantone %": 57.0,
    "Print Required": 300,
    "Print Approved": 200,
    "Print Pending": 100,
    "Print %": 67.0,
    "PP Required": 300,
    "PP Approved": 190,
    "PP Pending": 110,
    "PP %": 63.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Madhu Garments",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Jackets",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 15,
    "Pantone Approved": 0,
    "Pantone Pending": 15,
    "Pantone %": 0.0,
    "Print Required": 20,
    "Print Approved": 5,
    "Print Pending": 15,
    "Print %": 25.0,
    "PP Required": 20,
    "PP Approved": 5,
    "PP Pending": 15,
    "PP %": 25.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Shree Tex",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Shirts",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 20,
    "Pantone Approved": 10,
    "Pantone Pending": 10,
    "Pantone %": 50.0,
    "Print Required": 120,
    "Print Approved": 60,
    "Print Pending": 60,
    "Print %": 50.0,
    "PP Required": 120,
    "PP Approved": 55,
    "PP Pending": 65,
    "PP %": 45.8,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Anjali Threads",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Skirts",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 40,
    "Pantone Approved": 20,
    "Pantone Pending": 20,
    "Pantone %": 50.0,
    "Print Required": 250,
    "Print Approved": 100,
    "Print Pending": 150,
    "Print %": 40.0,
    "PP Required": 250,
    "PP Approved": 80,
    "PP Pending": 170,
    "PP %": 32.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Bharat Exports",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Jeans",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 10,
    "Pantone Approved": 5,
    "Pantone Pending": 5,
    "Pantone %": 50.0,
    "Print Required": 60,
    "Print Approved": 20,
    "Print Pending": 40,
    "Print %": 33.3,
    "PP Required": 60,
    "PP Approved": 20,
    "PP Pending": 40,
    "PP %": 33.3,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Classic Stitch",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Kurta",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 18,
    "Pantone Approved": 9,
    "Pantone Pending": 9,
    "Pantone %": 50.0,
    "Print Required": 180,
    "Print Approved": 100,
    "Print Pending": 80,
    "Print %": 55.5,
    "PP Required": 180,
    "PP Approved": 90,
    "PP Pending": 90,
    "PP %": 50.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "StylePoint",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Shorts",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 22,
    "Pantone Approved": 16,
    "Pantone Pending": 6,
    "Pantone %": 73.0,
    "Print Required": 140,
    "Print Approved": 120,
    "Print Pending": 20,
    "Print %": 85.7,
    "PP Required": 140,
    "PP Approved": 110,
    "PP Pending": 30,
    "PP %": 78.6,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Elegant Wear",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Dresses",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 32,
    "Pantone Approved": 28,
    "Pantone Pending": 4,
    "Pantone %": 87.5,
    "Print Required": 310,
    "Print Approved": 250,
    "Print Pending": 60,
    "Print %": 80.6,
    "PP Required": 310,
    "PP Approved": 240,
    "PP Pending": 70,
    "PP %": 77.4,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Manvi Exports",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Leggings",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 14,
    "Pantone Approved": 7,
    "Pantone Pending": 7,
    "Pantone %": 50.0,
    "Print Required": 100,
    "Print Approved": 70,
    "Print Pending": 30,
    "Print %": 70.0,
    "PP Required": 100,
    "PP Approved": 65,
    "PP Pending": 35,
    "PP %": 65.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Urban Tailors",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Jumpsuits",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 25,
    "Pantone Approved": 10,
    "Pantone Pending": 15,
    "Pantone %": 40.0,
    "Print Required": 200,
    "Print Approved": 80,
    "Print Pending": 120,
    "Print %": 40.0,
    "PP Required": 200,
    "PP Approved": 90,
    "PP Pending": 110,
    "PP %": 45.0,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Raj Apparels",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Blazers",
    "Gender": "Men",
    "Season": "SS26",
    "Pantone Required": 12,
    "Pantone Approved": 6,
    "Pantone Pending": 6,
    "Pantone %": 50.0,
    "Print Required": 90,
    "Print Approved": 45,
    "Print Pending": 45,
    "Print %": 50.0,
    "PP Required": 90,
    "PP Approved": 40,
    "PP Pending": 50,
    "PP %": 44.4,
  },
  {
    "Sourcing Spoc": "Ravi",
    "Vendor Name": "Bright Looms",
    "Status Date": "20-06-2025",
    "Brand": "xyz",
    "Article Type": "Anarkali",
    "Gender": "Women",
    "Season": "SS26",
    "Pantone Required": 36,
    "Pantone Approved": 30,
    "Pantone Pending": 6,
    "Pantone %": 83.3,
    "Print Required": 350,
    "Print Approved": 300,
    "Print Pending": 50,
    "Print %": 85.7,
    "PP Required": 350,
    "PP Approved": 290,
    "PP Pending": 60,
    "PP %": 82.8,
  },
];

export default function ConsolidatedStatusView() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(tableData);

  useEffect(() => {
    setFiltered(
      tableData.filter((row) =>
        row["Article Type"].toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consolidated Status");
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(fileData, "consolidated_status.xlsx");
  };

  return (
    <div className="pt-8 px-4 mt-14">
      <div className="w-[90vw] max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-2 sm:mb-0">Consolidated Status View</h1>
          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            Download File
          </button>
        </div>
        <input
          type="text"
          placeholder="Search Article Type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full max-w-xs"
        />
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <table className="min-w-full whitespace-nowrap">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 font-medium text-xs text-gray-700 tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr key={idx} className="border-t">
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 text-sm text-gray-700 max-w-[120px] truncate"
                      title={String(row[col])}
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
