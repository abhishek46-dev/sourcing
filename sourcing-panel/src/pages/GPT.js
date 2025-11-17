import React, { useEffect, useState } from 'react';

export default function GPT() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/gptreports')
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  const handleRowClick = (report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GPT Report</h1>
      <div className="bg-white rounded shadow p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left p-2">GPT REPORT ID</th>
              <th className="text-left p-2">Style Name</th>
              <th className="text-left p-2">PO Number</th>
              <th className="text-left p-2">Season</th>
              <th className="text-left p-2">Created On</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(report)}>
                <td className="p-2">GPT-{report.createdAt ? new Date(report.createdAt).toISOString().slice(0,10).replace(/-/g,"") : ''}-001</td>
                <td className="p-2">{report.styleId}</td>
                <td className="p-2">{report.poNumber}</td>
                <td className="p-2">{report.season}</td>
                <td className="p-2">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ''}</td>
                <td className="p-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{report.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for report details */}
      {modalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4">GPT Report Details</h2>
            {selectedReport.files && selectedReport.files.length > 0 && (
              <div className="mb-4">
                <img
                  src={`http://localhost:3001/api/file/${selectedReport.files[0].fileId}`}
                  alt={selectedReport.files[0].name}
                  className="max-h-64 object-contain border rounded mb-2"
                />
                <div className="text-xs text-gray-500">{selectedReport.files[0].name}</div>
              </div>
            )}
            <div className="mb-2"><strong>Submitter:</strong> {selectedReport.manager}</div>
            <div className="mb-2"><strong>Style Number:</strong> {selectedReport.styleId}</div>
            <div className="mb-2"><strong>PO Number:</strong> {selectedReport.poNumber}</div>
            <div className="mb-2"><strong>Season:</strong> {selectedReport.season}</div>
            <div className="mb-2"><strong>Status:</strong> {selectedReport.status}</div>
            <div className="mb-2"><strong>Created At:</strong> {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleDateString() : ''}</div>
          </div>
        </div>
      )}
    </div>
  );
} 