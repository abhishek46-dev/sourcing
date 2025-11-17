import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AssortmentPlans() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/assortment-plans')
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  const filteredPlans = plans.filter(plan =>
    (plan.id || '').toLowerCase().includes(search.toLowerCase()) &&
    (season ? plan.season === season : true)
  );

  const seasons = Array.from(new Set(plans.map(p => p.season)));

  if (selectedPlan) {
    const filteredDetails = (selectedPlan.details || []).filter(item =>
      (item.category || '').toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="pt-24 px-8 pb-8">
        <div className="text-sm text-gray-400 mb-2 cursor-pointer" onClick={() => setSelectedPlan(null)}>
          All Assortment Plans / Assortment Plan {selectedPlan.id}
        </div>
        <h1 className="text-2xl font-bold mb-4">Assortment Plan {selectedPlan.id}</h1>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Assortment"
            className="border rounded px-3 py-2 w-64"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-xl shadow p-4 border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b">
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Range</th>
                <th className="px-3 py-2 text-left">MRP</th>
                <th className="px-3 py-2 text-left">MIX</th>
                <th className="px-3 py-2 text-left">ASRP</th>
                <th className="px-3 py-2 text-left">PP Segment</th>
                <th className="px-3 py-2 text-left">Basic/Fashion</th>
                <th className="px-3 py-2 text-left">Discount</th>
                <th className="px-3 py-2 text-left">DEPTH</th>
                <th className="px-3 py-2 text-left">QTY</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((row, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2">{row.range}</td>
                  <td className="px-3 py-2">{row.mrp}</td>
                  <td className="px-3 py-2">{row.mix}</td>
                  <td className="px-3 py-2">{row.asrp}</td>
                  <td className="px-3 py-2">{row.ppSegment}</td>
                  <td className="px-3 py-2">{row.basicFashion}</td>
                  <td className="px-3 py-2">{row.discount}</td>
                  <td className="px-3 py-2">{row.depth}</td>
                  <td className="px-3 py-2">{row.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-8 pb-8">
      <h1 className="text-2xl font-bold mb-1">Assortment Plan</h1>
      <p className="text-gray-500 mb-6">Plan and structure your product mix across categories and timelines.</p>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Assortment"
          className="border rounded px-3 py-2 w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={season}
          onChange={e => setSeason(e.target.value)}
        >
          <option value="">Season</option>
          {seasons.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map(plan => (
          <div key={plan._id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition cursor-pointer" onClick={() => setSelectedPlan(plan)}>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v3.75m9 0v6.75A2.25 2.25 0 0114.25 19.5h-4.5A2.25 2.25 0 017.5 17.25V10.5m9 0h-9" />
                </svg>
              </span>
              <span className="font-semibold text-lg">{plan.id || 'No ID'}</span>
              <span className="ml-auto text-gray-400">&gt;</span>
            </div>
            <div className="flex gap-8 mt-2 text-xs text-gray-500">
              <div>
                <div className="font-medium">SEASON</div>
                <div className="text-gray-700">{plan.season || '-'}</div>
              </div>
              <div>
                <div className="font-medium">ADDED DATE</div>
                <div className="text-gray-700">{plan.addedDate || '-'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 