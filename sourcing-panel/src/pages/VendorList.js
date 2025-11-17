import React, { useEffect, useState } from 'react';
import venImg from '../assets/ven.png';

const API_URL = 'http://localhost:3001/api/vendors';

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '' });
  const [selected, setSelected] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    setVendors(data);
    setLoading(false);
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowAdd(false);
      setShowSuccess(true);
      setForm({ name: '', mobile: '', email: '' });
      fetchVendors();
    }
  };

  const handleDeleteVendor = async () => {
    if (!deleteTarget) return;
    await fetch(`${API_URL}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [deleteTarget] }),
    });
    setShowDeleteModal(false);
    setDeleteTarget(null);
    fetchVendors();
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  // Empty state
  if (!loading && vendors.length === 0 && !showAdd && !showSuccess) {
    return (
      <div className="p-8 mt-20">
        <h1 className="text-2xl font-bold mb-1">Vendors</h1>
        <p className="text-gray-500 mb-6">Easily onboard, manage, and track vendor setup and documentation.</p>
        <div className="bg-white rounded-xl shadow p-20 flex flex-col items-center justify-center min-h-[520px] max-w-3xl mx-auto">
          <img src={venImg} alt="No Vendors" className="w-100 h-80 mb-8" />
          
          <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={() => setShowAdd(true)}>
            Add First Vendor
          </button>
        </div>
      </div>
    );
  }

  // Add vendor form
  if (showAdd) {
    return (
      <div className="p-8 mt-20">
        <h1 className="text-2xl font-bold mb-1">Vendors</h1>
        <p className="text-gray-500 mb-6">Easily onboard, manage, and track vendor setup and documentation.</p>
        <div className="bg-white rounded-xl shadow p-8">
          <div className="font-semibold text-lg mb-6">Please select the following details to continue</div>
          <form className="flex gap-4 mb-8" onSubmit={handleAddVendor}>
            <input
              type="text"
              placeholder="Vendor Name"
              className="border rounded px-4 py-3 flex-1"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="border rounded px-4 py-3 flex-1"
              value={form.mobile}
              onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border rounded px-4 py-3 flex-1"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </form>
          <div className="flex justify-end">
            <button
              className="bg-blue-400 text-white px-8 py-2 rounded disabled:opacity-50"
              onClick={handleAddVendor}
              disabled={!form.name || !form.mobile || !form.email}
            >
              Save Files
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="p-8 mt-20">
        <h1 className="text-2xl font-bold mb-1">Vendors</h1>
        <p className="text-gray-500 mb-6">Easily onboard, manage, and track vendor setup and documentation.</p>
        <div className="bg-white rounded-xl shadow p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#34D399" opacity="0.2"/><path d="M8 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="text-lg font-semibold mb-2">First Vendor Onboarded</div>
          <div className="text-gray-500 text-center mb-6 max-w-md">
            An invite has been sent with login instructions. You can now view and manage vendor details.
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={() => setShowSuccess(false)}>
            Go to All Vendors
          </button>
        </div>
      </div>
    );
  }

  // Vendor list table
  return (
    <div className="p-8 mt-20">
      <h1 className="text-2xl font-bold mb-1">Vendors</h1>
      <p className="text-gray-500 mb-6">Easily onboard, manage, and track vendor setup and documentation.</p>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search Vendor name..."
            className="border rounded px-3 py-2 w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowAdd(true)}>
            Add New Vendor
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b">
                <th className="px-3 py-2 text-left"><input type="checkbox" onChange={e => setSelected(e.target.checked ? filteredVendors.map(v => v._id) : [])} checked={selected.length === filteredVendors.length && filteredVendors.length > 0} /></th>
                <th className="px-3 py-2 text-left">Vendor Name</th>
                <th className="px-3 py-2 text-left">Mobile number</th>
                <th className="px-3 py-2 text-left">Email ID</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(v => (
                <tr key={v._id} className="border-b last:border-0 hover:bg-blue-50">
                  <td className="px-3 py-2"><input type="checkbox" checked={selected.includes(v._id)} onChange={e => setSelected(sel => e.target.checked ? [...sel, v._id] : sel.filter(id => id !== v._id))} /></td>
                  <td className="px-3 py-2">{v.name}</td>
                  <td className="px-3 py-2">{v.mobile}</td>
                  <td className="px-3 py-2">{v.email}</td>
                  <td className="px-3 py-2">
                    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded text-xs font-semibold">PENDING</span>
                  </td>
                  <td className="px-3 py-2">
                    <button className="p-1 rounded hover:bg-gray-100" onClick={() => { setDeleteTarget(v._id); setShowDeleteModal(true); }}>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F87171" opacity="0.2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Bulk actions bar */}
        {selected.length > 0 && (
          <div className="fixed bottom-6 left-72 right-6 bg-[#011F33] text-white rounded-xl flex items-center justify-between px-6 py-4 shadow-lg z-50">
            <div className="flex items-center gap-4">
              <span>{selected.length} Selected</span>
              <button className="bg-white/10 px-3 py-1 rounded" onClick={() => setSelected(filteredVendors.map(v => v._id))}>Select all</button>
              <button className="bg-white/10 px-3 py-1 rounded" onClick={() => setSelected([])}>×</button>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setShowDeleteModal(true)}>Delete Vendor</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed" disabled>Edit Vendor</button>
            </div>
          </div>
        )}
        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative flex flex-col items-center">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>&times;</button>
              <img src={venImg} alt="Delete Vendor" className="w-20 h-20 mb-4" />
              <div className="text-lg font-semibold mb-2 text-center">Are you sure you want to delete the Vendor</div>
              <div className="text-gray-500 text-center mb-6">Are you sure you want to delete vendor from the sourcing panel?</div>
              <div className="flex gap-4 w-full justify-center">
                <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>Cancel</button>
                <button className="bg-red-600 text-white px-6 py-2 rounded" onClick={handleDeleteVendor}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 