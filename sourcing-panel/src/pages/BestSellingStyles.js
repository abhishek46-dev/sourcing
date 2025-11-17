import React, { useEffect, useState } from 'react';

const tableColumns = [
  { key: 'styleId', label: 'Style ID' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'manager', label: 'Manager' },
  { key: 'color', label: 'Color' },
  { key: 'fabricType', label: 'Fabric Type' },
  { key: 'fabricContent', label: 'Fabric Content' },
  { key: 'pattern', label: 'Pattern' },
  { key: 'gsm', label: 'GSM' },
  { key: 'uploadedDate', label: 'Uploaded Date' },
];

function groupByManager(styles) {
  const map = {};
  styles.forEach(style => {
    const manager = style.manager || 'Unknown';
    if (!map[manager]) {
      map[manager] = {
        name: manager,
        total: 0,
        styles: [],
      };
    }
    map[manager].total += 1;
    map[manager].styles.push(style);
  });
  return Object.values(map);
}

export default function BestSellingStyles() {
  const [styles, setStyles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/best-selling-styles')
      .then(res => res.json())
      .then(data => setStyles(data));
  }, []);

  const grouped = groupByManager(
    styles.filter(style =>
      style.manager?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Card view for managers
  if (!selectedManager) {
    return (
      <div className="p-8 mt-20">
        <h1 className="text-2xl font-bold mb-1">Best Selling Styles</h1>
        <p className="text-gray-500 mb-6">Browse your most successful styles across seasons and categories.</p>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search Managers..."
              className="border rounded px-3 py-2 w-80"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="ml-auto border px-4 py-2 rounded flex items-center gap-2 text-gray-700 hover:bg-gray-100">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="5" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="17" width="16" height="2" rx="1" fill="#6B7280"/></svg>
              SORT
            </button>
          </div>
          <div className="flex gap-6">
            {grouped.map(manager => (
              <div
                key={manager.name}
                className="bg-blue-50 rounded-xl shadow hover:shadow-lg cursor-pointer w-80 p-6 flex flex-col justify-between min-h-[140px] border border-blue-100"
                onClick={() => setSelectedManager(manager)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#2563EB"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#2563EB"/></svg>
                  </div>
                  <span className="font-semibold">{manager.name}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <div>
                    <div className="mb-1">TOTAL STYLES</div>
                    <div className="text-lg text-gray-800 font-semibold">{manager.total}</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Table view for selected manager
  const filtered = selectedManager.styles.filter(style =>
    style.styleId?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  const handleSelectRow = (id, checked) => {
    setSelectedRows(prev =>
      checked ? [...prev, id] : prev.filter(k => k !== id)
    );
  };

  const handleSelectAll = checked => {
    setSelectedRows(checked ? paginated.map(style => style._id) : []);
  };

  const handleSubmit = () => {
    setShowVendorModal(true);
  };

  const handleVendorSubmit = () => {
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setSelectedRows([]);
      setShowVendorModal(false);
      setSelectedVendor('');
      setTimeout(() => setSuccess(false), 2500);
    }, 800);
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 cursor-pointer" onClick={() => setSelectedManager(null)}>
        <span>All Managers</span>
        <span>&gt;</span>
        <span className="text-gray-700">{selectedManager.name}</span>
      </div>
      <h1 className="text-2xl font-bold mb-1">{selectedManager.name}</h1>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search StyleID..."
          className="border rounded px-3 py-2 w-80"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded flex items-center gap-2 text-gray-700 hover:bg-gray-100">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="5" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="17" width="16" height="2" rx="1" fill="#6B7280"/></svg>
            FILTER
          </button>
          <button className="border px-4 py-2 rounded flex items-center gap-2 text-gray-700 hover:bg-gray-100">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            STATUS
          </button>
        </div>
      </div>
      {success && (
        <div className="bg-green-500 text-white px-6 py-2 rounded mb-4 text-center font-semibold">Styles Successfully Submitted to Vendor</div>
      )}
      <div className="bg-white rounded-xl shadow p-4 border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b">
              <th className="px-3 py-2 text-left"><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={selectedRows.length === paginated.length && paginated.length > 0} /></th>
              {tableColumns.map(col => (
                <th key={col.key} className="px-3 py-2 text-left">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(style => (
              <tr key={style._id} className="border-b last:border-0 hover:bg-blue-50">
                <td className="px-3 py-2"><input type="checkbox" checked={selectedRows.includes(style._id)} onChange={e => handleSelectRow(style._id, e.target.checked)} /></td>
                {tableColumns.map(col => (
                  <td key={col.key} className="px-3 py-2">{col.key === 'uploadedDate' && style[col.key] ? new Date(style[col.key]).toLocaleDateString() : (style[col.key] || '-')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm">
          <span>Page Size</span>
          <select className="border rounded px-2 py-1" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
            {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p-1))}>Previous</button>
          <button className="border px-3 py-1 rounded" disabled={page * pageSize >= filtered.length} onClick={() => setPage(p => p+1)}>Next</button>
        </div>
      </div>
      {/* Sticky bottom bar for submit */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-64 right-6 z-50 flex items-center justify-between bg-white shadow-lg rounded-xl px-8 py-4 border">
          <div className="font-semibold">{selectedRows.length} Selected</div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleSubmit}>Submit to Vendor</button>
        </div>
      )}
      {/* Vendor selection modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowVendorModal(false)}>&times;</button>
            <h3 className="font-semibold mb-2">Choose the Vendor to send</h3>
            <select
              className="border rounded w-full p-2 mb-4"
              value={selectedVendor}
              onChange={e => setSelectedVendor(e.target.value)}
            >
              <option value="">Select Vendor</option>
              <option value="abc vendor">abc vendor</option>
              <option value="fax vendor">fax vendor</option>
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={handleVendorSubmit}
              disabled={!selectedVendor}
            >
              Submit to Vendor
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 