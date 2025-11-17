import React, { useEffect, useState } from 'react';

// A very simple placeholder page for now
export default function FinalInspectionreport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: replace with real API endpoint once backend is ready
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:3001/api/final-inspection-report');
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="p-8 mt-28">
      <h1 className="text-2xl font-bold mb-4">Final Inspection Report</h1>
      {/* Simple JSON dump for now */}
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
