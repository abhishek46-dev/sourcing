import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const defaultColumns = [
  { key: 'name', label: 'Tech Pack name' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'colour', label: 'Colour' },
  { key: 'fit', label: 'Fit' },
  { key: 'printtechnique', label: 'Print Technique' },
  { key: 'status', label: 'Status' },
];

const extraColumns = [
  { key: 'consumption', label: 'Consumption' },
  { key: 'targetCost', label: 'Target Cost' },
  { key: 'vendorName', label: 'Vendor Name' },
  { key: 'leadTime', label: 'Lead Time' },
  { key: 'finalTime', label: 'Final Time' },
  { key: 'custom', label: 'Custom' },
];

const statusColors = {
  ACCEPTED: 'bg-green-100 text-green-700 border-green-300',
  REJECTED: 'bg-red-100 text-red-700 border-red-300',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
};

function groupByBrandManager(techpacks) {
  const map = {};
  techpacks.forEach(tp => {
    const manager = tp.brandManager || 'Unknown';
    if (!map[manager]) {
      map[manager] = {
        name: manager,
        techPacks: 0,
        submittedOn: tp.timestamp || '',
        techPackDetails: [],
      };
    }
    map[manager].techPacks += 1;
    map[manager].techPackDetails.push(tp);
  });
  return Object.values(map);
}

export default function TechpackView() {
  const [techpacks, setTechpacks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [columns, setColumns] = useState(defaultColumns);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [pdfModal, setPdfModal] = useState({ open: false, url: '' });
  const [galleryModal, setGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  // Excel files drawer state
  const [filesDrawer, setFilesDrawer] = useState(false);
  const [excelFiles, setExcelFiles] = useState([]);

  useEffect(() => {
    // fetch techpacks

    fetch('http://localhost:3001/api/tech--packs')
      .then(res => res.json())
      .then(data => setTechpacks(data));
    // prefetch excel metadata
    fetch('http://localhost:3001/api/techpack-excels')
      .then(res => res.json())
      .then(setExcelFiles)
      .catch(() => {});
  }, []);

  const grouped = groupByBrandManager(
    techpacks.filter(tp =>
      tp.brandManager?.toLowerCase().includes(search.toLowerCase())
    )
  );

  // If a manager is selected, show the table view for that manager
  if (selectedManager) {
    const manager = grouped.find(m => m.name === selectedManager);
    const filtered = manager.techPackDetails.filter(tp =>
      tp.name?.toLowerCase().includes(search.toLowerCase()) ||
      tp.description?.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddColumn = (col) => {
      if (!columns.find(c => c.key === col.key)) {
        setColumns([...columns, col]);
      }
      setShowDropdown(false);
    };

    const handleSelectRow = (id, checked) => {
      setSelectedRows(prev =>
        checked ? [...prev, id] : prev.filter(k => k !== id)
      );
    };

    const handleEditCell = (tpId, colKey, value) => {
      setEditedData(prev => ({
        ...prev,
        [tpId]: { ...prev[tpId], [colKey]: value },
      }));
    };

    const handleSendToVendor = async () => {
      if (uploadedFiles.length === 0 || !selectedVendor) {
        return;
      }

      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('vendor', selectedVendor);
  formData.append('techpackIds', JSON.stringify(selectedRows));

      try {
        const response = await fetch('http://localhost:3001/api/upload-techpack-files', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // Reset state after successful upload
          setShowUpload(false);
          setUploadedFiles([]);
          setSelectedRows([]);
          setSelectedVendor('');
          setShowSuccess(true);
        } else {
          console.error('Failed to upload files');
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    };

    const handleUploadFiles = (e) => {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
    };

    const handleRowClick = (tp) => {
      const url = tp.pdfUrl || `http://localhost:3001/api/tech--packs/pdf/${tp._id}` || tp.pdfview || tp.previewUrl;
      if (url) {
        setPdfModal({ open: true, url });
      }
    };

    const handleCloseModal = () => setPdfModal({ open: false, url: '' });

    if (showSuccess) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-6 mb-6 flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="28" fill="#22C55E" fillOpacity="0.15"/>
                <path d="M39 23L26.75 35L21 29.2727" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-xl font-semibold mb-2 text-center">Your file have been saved Successfully</div>
            <div className="text-gray-500 mb-6 text-center">You can track status from the Techpacks section</div>
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
              onClick={() => { setShowSuccess(false); setSelectedManager(null); }}
            >
              Go to Techpacks
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 mt-20">
        <div className="flex items-center justify-between mb-4 relative">
          {/* Files button */}
          <button
            className="absolute right-0 -top-10 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => setFilesDrawer(true)}
          >
            Files
          </button>
          <div>
            <div className="text-xs text-gray-400 mb-1 cursor-pointer" onClick={() => setSelectedManager(null)}>
              All Brand Managers &gt; {manager.name}
            </div>
            <h1 className="text-2xl font-bold mb-1">Tech Pack Details</h1>
          </div>
          <div className="flex gap-2">
            <button className="border px-4 py-2 rounded flex items-center gap-2 text-gray-700 hover:bg-gray-100">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="5" width="16" height="2" rx="1" fill="#6B7280"/><rect x="4" y="17" width="16" height="2" rx="1" fill="#6B7280"/></svg>
              FILTER
            </button>
            <button className="border px-4 py-2 rounded flex items-center gap-2 text-gray-700 hover:bg-gray-100">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#6B7280" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              STATUS
            </button>
            <button className="border px-3 py-2 rounded flex items-center hover:bg-gray-100" title="Grid View" onClick={() => { setGalleryModal(true); setGalleryIndex(0); }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" fill="#6B7280"/><rect x="14" y="3" width="7" height="7" rx="2" fill="#6B7280"/><rect x="14" y="14" width="7" height="7" rx="2" fill="#6B7280"/><rect x="3" y="14" width="7" height="7" rx="2" fill="#6B7280"/></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Techpack"
            className="border rounded px-3 py-2 w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {/* Upload Files button fixed at bottom right */}
        {selectedRows.length > 0 && !showUpload && (
          <button
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50"
            style={{ minWidth: 160 }}
            onClick={() => setShowUpload(true)}
          >
            Upload Files
          </button>
        )}

        {/* Upload UI Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative flex flex-col items-center border-2 border-dashed border-blue-300" style={{ minHeight: 340 }}>
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => { setShowUpload(false); setUploadedFiles([]); setSelectedVendor(""); }}>&times;</button>
              <h2 className="text-lg font-bold mb-2">Upload required files for the techpack</h2>
              <ul className="text-sm text-gray-700 mb-2 list-disc pl-5 text-left w-full">
                <li>Spec Sheet (e.g., measurements, materials, construction details)</li>
                <li>Marker File (e.g., fabric layout for cutting)</li>
                <li>Nominated Trim Details (select from approved trim list)</li>
                <li>Nominated Supplier Details (select from approved supplier list)</li>
              </ul>
              <div className="w-full flex flex-col items-center justify-center mb-4">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                  <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16v-4m0 0V8a4 4 0 118 0v4m-8 0h8" /></svg>
                  <span className="text-gray-600">Drag & drop one or more techpack files,<br/>or <span className="text-blue-600 underline">click to upload</span></span>
                  <input id="file-upload" type="file" multiple className="hidden" onChange={handleUploadFiles} />
                  <span className="text-xs text-gray-500 mt-2">The techpack file should have the same format as the sample file.<br/>The file type should be .csv, .xls, .xlsx or .zip and should be &lt; 50MB in size.</span>
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 w-full">
                    <div className="font-semibold text-sm mb-1">Selected files:</div>
                    <ul className="list-disc pl-6 text-xs text-gray-700">
                      {uploadedFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Vendor dropdown after files uploaded */}
              {uploadedFiles.length > 0 && (
                <div className="w-full flex flex-col items-start mb-2">
                  <label htmlFor="vendor-select" className="font-semibold text-sm mb-1">Select Vendor</label>
                  <select
                    id="vendor-select"
                    className="border rounded px-3 py-2 w-full"
                    value={selectedVendor}
                    onChange={e => setSelectedVendor(e.target.value)}
                  >
                    <option value="" disabled>Select a vendor...</option>
                    <option value="abh vendors">abh vendors</option>
                    <option value="v suppliers">v suppliers</option>
                    <option value="NTF.co">NTF.co</option>
                    <option value="ABC Garments">ABC Garments</option>
                    <option value="XYZ Textiles">XYZ Textiles</option>
                  </select>
                </div>
              )}
              <div className="w-full flex items-center gap-2 mt-2">
                <span className="text-yellow-600 text-xs bg-yellow-50 px-2 py-1 rounded">Note: Make sure file names follow the sample format provided.</span>
              </div>
              {/* Send to Vendor button inside modal */}
              <div className="w-full flex justify-end mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSendToVendor} disabled={uploadedFiles.length === 0 || !selectedVendor}>
                  Send to Vendor
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow p-4 border overflow-x-auto max-h-[70vh] overflow-y-auto no-scrollbar max-w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-xs border-b">
                <th className="px-3 py-2 text-left"><input type="checkbox" onChange={e => setSelectedRows(e.target.checked ? filtered.map(tp => tp._id) : [])} checked={selectedRows.length === filtered.length && filtered.length > 0} /></th>
                {columns.map(col => (
                  <th key={col.key} className="px-3 py-2 text-left">{col.label}</th>
                ))}
                <th className="px-3 py-2 text-left">
                  <button className="text-lg font-bold" onClick={() => setShowDropdown(!showDropdown)}>+</button>
                  {showDropdown && (
                    <div className="absolute mt-2 bg-white border rounded shadow z-10">
                      {extraColumns.map(col => (
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
              {filtered.map(tp => (
                <tr key={tp._id} className="border-b last:border-0 cursor-pointer hover:bg-blue-50" onClick={e => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') handleRowClick(tp); }}>
                  <td className="px-3 py-2"><input type="checkbox" checked={selectedRows.includes(tp._id)} onChange={e => handleSelectRow(tp._id, e.target.checked)} onClick={e => e.stopPropagation()} /></td>
                  {columns.map(col => (
                    <td key={col.key} className="px-3 py-2">
                      {col.key === 'status' ? (
                        <span className={`px-3 py-1 border text-xs font-semibold ${statusColors[tp.status] || ''}`}>{tp.status}</span>
                      ) : col.key === 'category' ? (
                        'sweatshirt'
                      ) : col.key === 'printtechnique' ? (
                        'puffprint'
                      ) : extraColumns.find(ec => ec.key === col.key) ? (
                        <input
                          className="border rounded px-2 py-1 w-24"
                          value={editedData[tp._id]?.[col.key] ?? tp[col.key] ?? ''}
                          onChange={e => handleEditCell(tp._id, col.key, e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        tp[col.key] || '-'
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* PDF Modal */}
        {pdfModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={handleCloseModal}>&times;</button>
              {
              (()=>{
                const src = pdfModal.url;
                const hasHash = src.includes('#');
                const viewerParams = 'navpanes=0&scrollbar=0';
                const finalSrc = hasHash ? `${src}&${viewerParams}` : `${src}#${viewerParams}`;
                return <iframe src={finalSrc} title="Techpack Preview" className="w-full h-[80vh] rounded border" />;
              })()
            }
            </div>
          </div>
        )}
        {/* Gallery Modal */}
        {galleryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative flex flex-col items-center max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setGalleryModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-4">All Techpack Images</h2>
              <div className="flex flex-col gap-8 w-full">
                {filtered.map((tp, idx) => {
                  const url = tp.pdfUrl || `http://localhost:3001/api/tech--packs/pdf/${tp._id}`;
                  return (
                    <div key={tp._id} className="flex flex-col items-center w-full">
                      {(()=>{const src=url;const vp='navpanes=0&scrollbar=0';const final=src.includes('#')?`${src}&${vp}`:`${src}#${vp}`;return <iframe src={final} title={tp.name} className="w-full h-[60vh] rounded border mb-2"/>;})()}
                      <div className="text-sm text-gray-700 mb-4">{tp.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: show card view
  return (
    <>
      <div className="p-8 mt-20">
      <div className="flex items-start justify-between relative">
        <h1 className="text-2xl font-bold mb-1">Techpacks</h1>
        <button
          className="absolute right-0 -top-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setFilesDrawer(true)}
        >
          Files
        </button>
      </div>
      <p className="text-gray-500 mb-6">Track the status .</p>
      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search Brand Manager.."
          className="border rounded px-3 py-2 w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="ml-auto border rounded px-3 py-2 flex items-center gap-2">
          <span>Sort</span>
          <svg width="16" height="16" fill="none"><path d="M4 6l4 4 4-4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grouped.map(manager => (
          <div
            key={manager.name}
            className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedManager(manager.name)}
          >
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75A2.25 2.25 0 0014.25 4.5h-4.5A2.25 2.25 0 007.5 6.75v3.75m9 0v6.75A2.25 2.25 0 0114.25 19.5h-4.5A2.25 2.25 0 017.5 17.25V10.5m9 0h-9" />
                </svg>
              </span>
              <span className="font-semibold text-lg">{manager.name}</span>
              <span className="ml-auto text-gray-400">&gt;</span>
            </div>
            <div className="flex gap-8 mt-2 text-xs text-gray-500">
              <div>
                <div className="font-medium">TECH PACKS</div>
                <div className="text-gray-700">{manager.techPacks}</div>
              </div>
              <div>
                <div className="font-medium">SUBMITTED ON</div>
                <div className="text-gray-700">{manager.submittedOn}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Files Drawer */}
    {filesDrawer && (
      <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 flex flex-col border-l">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Excel Files</h2>
          <button className="text-xl" onClick={() => setFilesDrawer(false)}>&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {excelFiles.length === 0 ? (
            <div className="text-gray-500 text-sm">No files available</div>
          ) : (
            <ul className="space-y-3 text-sm">
              {excelFiles.map(file => (
                <li key={file._id} className="flex items-center justify-between border rounded p-2 hover:bg-gray-100">
                  <span className="truncate w-2/3" title={file.fileName}>{file.fileName}</span>
                  <button
                    className="text-blue-600 underline"
                    onClick={async () => {
                      try {
                        const res = await fetch(`http://localhost:3001/api/techpack-excels/${file._id}/url`);
                        const { url } = await res.json();
                        window.open(url, '_blank');
                      } catch {}
                    }}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )}
      </>
  );
}