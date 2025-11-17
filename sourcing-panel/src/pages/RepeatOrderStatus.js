import React, { useEffect, useState } from 'react';

const baseColumns = [
  { key: 'styleId', label: 'Style ID' },
  { key: 'vendor', label: 'Vendor Article No' },
  { key: 'color', label: 'Color' },
  { key: 'pattern', label: 'Style Patterns' },
  { key: 'fabricType', label: 'Fabric Type' },
  { key: 'fabricPattern', label: 'Fabric Pattern' },
  { key: 'fabricContent', label: 'Fabric Content' },
  { key: 'gsm', label: 'GSM' },
  { key: 'finalQty', label: 'Final QTY' },
  { key: 'targetCost', label: 'Target Cost' },
];

const extraColumns = [
  { key: 'finalCostByVendor', label: 'Final Cost By Vendor' },
  { key: 'finalCostBySourcingManager', label: 'Final Cost by sourcing manager' },
];

const vendorOptions = [
  { value: 'abc vendor', label: 'ABC Vendor' },
  { value: 'fax vendor', label: 'Fax Vendor' },
];

function groupByVendor(styles) {
  const map = {};
  styles.forEach(style => {
    const vendor = style.vendor || 'Unknown';
    if (!map[vendor]) {
      map[vendor] = {
        name: vendor,
        total: 0,
        assignedOn: style.uploadedDate || '',
        styles: [],
      };
    }
    map[vendor].total += 1;
    map[vendor].styles.push(style);
  });
  return Object.values(map);
}
 
export default function RepeatOrderStatus() {
  const [styles, setStyles] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [columns, setColumns] = useState([...baseColumns]);
  const [selectedVendorCard, setSelectedVendorCard] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterStyleId, setFilterStyleId] = useState('');
  const [filterColor, setFilterColor] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/best-selling-styles')
      .then(res => res.json())
      .then(data => setStyles(data));
  }, []);

  const groupedVendors = groupByVendor(styles.filter(style =>
    style.vendor?.toLowerCase().includes(search.toLowerCase())
  ));

  const filtered = styles.filter(style =>
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
    setSuccess(true);
    setSelectedRows([]);
    setShowVendorModal(false);
    setSelectedVendor('');
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleAddColumn = (col) => {
    if (!columns.find(c => c.key === col.key)) {
      setColumns([...columns, col]);
    }
    setShowColumnDropdown(false);
  };

  const handleEditCell = async (id, key, value) => {
    await fetch(`http://localhost:3001/api/best-selling-styles/${id}/final-order`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    });
    setStyles(styles => styles.map(s => s._id === id ? { ...s, [key]: value } : s));
    setSelectedVendorCard(vendor => {
      if (!vendor) return vendor;
      return {
        ...vendor,
        styles: vendor.styles.map(s => s._id === id ? { ...s, [key]: value } : s)
      };
    });
  };

  // Vendor card view
  if (!selectedVendorCard) {
    return (
      <div className="p-8 mt-20">
        <h1 className="text-2xl font-bold mb-1">Repeat Order Status</h1>
        <p className="text-gray-500 mb-6">Browse your most successful styles across seasons and categories.</p>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search Brand Managers..."
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
            {groupedVendors.map(vendor => (
              <div
                key={vendor.name}
                className="bg-blue-50 rounded-xl shadow hover:shadow-lg cursor-pointer w-80 p-6 flex flex-col justify-between min-h-[140px] border border-blue-100"
                onClick={() => setSelectedVendorCard(vendor)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 rounded-full p-2">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#2563EB"/><rect x="4" y="16" width="16" height="4" rx="2" fill="#2563EB"/></svg>
                  </div>
                  <span className="font-semibold">{vendor.name} Vendor</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-4">
                  <div>
                    <div className="mb-1">TOTAL STYLES</div>
                    <div className="text-lg text-gray-800 font-semibold">{vendor.total}</div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">ASSIGNED ON</div>
                    <div className="text-lg text-gray-800 font-semibold">{vendor.assignedOn ? new Date(vendor.assignedOn).toLocaleDateString() : '-'}</div>
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

  // Table view for selected vendor
  let filteredVendor = selectedVendorCard.styles;
  if (filterStyleId) {
    filteredVendor = filteredVendor.filter(style => style.styleId?.toLowerCase().includes(filterStyleId.toLowerCase()));
  }
  if (filterColor) {
    filteredVendor = filteredVendor.filter(style => style.color?.toLowerCase().includes(filterColor.toLowerCase()));
  }
  const paginatedVendor = filteredVendor.slice((page-1)*pageSize, page*pageSize);

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 cursor-pointer" onClick={() => setSelectedVendorCard(null)}>
        <span>All Vendors</span>
        <span>&gt;</span>
        <span className="text-gray-700">{selectedVendorCard.name}</span>
      </div>
      <h1 className="text-2xl font-bold mb-1">{selectedVendorCard.name} Vendor</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search Style ID"
            className="border rounded px-3 py-2 w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="ml-auto border px-4 py-2 rounded flex items-center gap-2 text-gray-700 hover:bg-gray-100" onClick={() => setShowFilter(v => !v)}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="5" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="17" width="16" height="2" rx="1" fill="#6B7280"/></svg>
            FILTER
          </button>
          {showFilter && (
            <div className="absolute right-10 top-24 bg-white border rounded shadow-lg z-10 p-4 flex flex-col gap-2">
              <label className="text-xs text-gray-500">Style ID</label>
              <input type="text" className="border rounded px-2 py-1" value={filterStyleId} onChange={e => setFilterStyleId(e.target.value)} />
              <label className="text-xs text-gray-500 mt-2">Color</label>
              <input type="text" className="border rounded px-2 py-1" value={filterColor} onChange={e => setFilterColor(e.target.value)} />
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowFilter(false)}>Apply</button>
            </div>
          )}
        </div>
        <div className="mb-4 border-b flex gap-8">
          <button className={`py-2 px-4 border-b-2 ${activeTab === 'details' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-500'}`} onClick={() => setActiveTab('details')}>Repeat Order Details</button>
          <button className={`py-2 px-4 border-b-2 ${activeTab === 'final' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-500'}`} onClick={() => setActiveTab('final')}>Repeat order confirmed final sheets</button>
        </div>
        {success && (
          <div className="bg-green-500 text-white px-6 py-2 rounded mb-4 text-center font-semibold">Styles Successfully Submitted to Vendor</div>
        )}
        {activeTab === 'details' && (
          <div className="bg-white rounded-xl shadow p-4 border overflow-hidden">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b">
                  <th className="px-3 py-2 text-left"><input type="checkbox" onChange={e => handleSelectAll(e.target.checked)} checked={selectedRows.length === paginatedVendor.length && paginatedVendor.length > 0} /></th>
                  {columns.map(col => (
                    <th key={col.key} className="px-3 py-2 text-left">{col.label}</th>
                  ))}
                  <th className="px-3 py-2 text-left relative">
                    <button className="border px-2 py-1 rounded flex items-center gap-1 text-gray-700 hover:bg-gray-100" onClick={() => setShowColumnDropdown(v => !v)} title="Add a Column">
                      +
                    </button>
                    {showColumnDropdown && (
                      <div className="absolute right-0 top-10 bg-white border rounded shadow-lg z-10">
                        {extraColumns.filter(col => !columns.find(c => c.key === col.key)).map(col => (
                          <div key={col.key} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddColumn(col)}>
                            {col.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendor.map(style => (
                  <tr key={style._id} className="border-b last:border-0 hover:bg-blue-50">
                    <td className="px-3 py-2"><input type="checkbox" checked={selectedRows.includes(style._id)} onChange={e => handleSelectRow(style._id, e.target.checked)} /></td>
                    {columns.map(col => (
                      <td key={col.key} className="px-3 py-2">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-24"
                          value={style[col.key] || ''}
                          onChange={e => handleEditCell(style._id, col.key, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'final' && (
          <div className="bg-white rounded-xl shadow p-4 border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b">
                  {columns.map(col => (
                    <th key={col.key} className="px-3 py-2 text-left">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredVendor.map(style => (
                  <tr key={style._id} className="border-b last:border-0 hover:bg-blue-50">
                    {columns.map(col => (
                      <td key={col.key} className="px-3 py-2">{col.key === 'uploadedDate' && style[col.key] ? new Date(style[col.key]).toLocaleDateString() : (style[col.key] || '-')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                {vendorOptions.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
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
    </div>
  );
} 