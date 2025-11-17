import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AssortmentPlanDetail() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/api/assortment-plans/${id}`)
      .then(res => res.json())
      .then(data => setPlan(data));
  }, [id]);

  if (!plan) return <div className="p-8">Loading...</div>;

  const filteredDetails = plan.details.filter(item =>
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.ppSegment.toLowerCase().includes(search.toLowerCase()) ||
    item.basicFashion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-gray-400 mb-1">All Assortments Plans &gt; Assortment Plan {plan.id}</div>
          <h1 className="text-2xl font-bold mb-1">Assortment Plan {plan.id}</h1>
        </div>
        <div className="text-sm text-gray-500">{plan.addedDate}</div>
      </div>
      <input
        type="text"
        placeholder="Search by Category, Fashion Type..."
        className="border rounded px-3 py-2 w-80 mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="bg-white rounded-xl shadow p-4 border">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b">
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">ASRP</th>
                <th className="px-3 py-2 text-left">PP Segment</th>
                <th className="px-3 py-2 text-left">Basic/Fashion</th>
                <th className="px-3 py-2 text-left">Mix</th>
                <th className="px-3 py-2 text-left">Depth</th>
                <th className="px-3 py-2 text-left">MRP</th>
                <th className="px-3 py-2 text-left">Discount</th>
                <th className="px-3 py-2 text-left">QTY</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="px-3 py-2">{item.category}</td>
                  <td className="px-3 py-2">{item.asrp}</td>
                  <td className="px-3 py-2">{item.ppSegment}</td>
                  <td className="px-3 py-2">{item.basicFashion}</td>
                  <td className="px-3 py-2">{item.mix}</td>
                  <td className="px-3 py-2">{item.depth}</td>
                  <td className="px-3 py-2">{item.mrp}</td>
                  <td className="px-3 py-2">{item.discount}</td>
                  <td className="px-3 py-2">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 