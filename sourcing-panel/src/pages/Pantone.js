import React, { useState, useEffect } from 'react';

const Pantone = () => {
  const [allRecords, setAllRecords] = useState([]);
  const [managerGroups, setManagerGroups] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managerRecords, setManagerRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [pantoneSearch, setPantoneSearch] = useState('');
  const [pantoneSortAsc, setPantoneSortAsc] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/pantones')
      .then(res => res.json())
      .then(data => {
        // Defensive: filter out records with no manager or pantoneNumber
        const validData = Array.isArray(data) ? data.filter(item => item.manager && item.pantoneNumber) : [];
        setAllRecords(validData);
        // Group by manager
        const grouped = {};
        validData.forEach(item => {
          const manager = item.manager || 'Unknown';
          if (!grouped[manager]) grouped[manager] = [];
          grouped[manager].push(item);
        });
        setManagerGroups(Object.entries(grouped).map(([manager, items]) => ({
          manager,
          count: items.length,
          lastDate: items[items.length - 1].createdAt?.slice(0, 10) || '',
        })));
        setLoading(false);
      })
      .catch(() => {
        setAllRecords([]);
        setLoading(false);
      });
  }, []);

  // --- Manager detail view ---
  if (selectedManager && managerRecords && managerRecords.length > 0) {
    // Filter and sort Pantone list for left container
    const filteredPantones = managerRecords
      .filter(rec => (rec.pantoneNumber || '').toLowerCase().includes(pantoneSearch.toLowerCase()))
      .sort((a, b) => {
        const aVal = a.pantoneNumber || '';
        const bVal = b.pantoneNumber || '';
        return pantoneSortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    const showMore = filteredPantones.length > 10;
    const visiblePantones = filteredPantones.slice(0, 10);
  
    return (
      <div style={{ background: '#F7F8FA', minHeight: '100vh', padding: 0, position: 'relative' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 0 16px 0', position: 'relative' }}>
          <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 8 }}>
            <span onClick={() => { setSelectedManager(null); setSelectedRecord(null); setPantoneSearch(''); setShowComments(false); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>All Sourcing managers</span>
            <span style={{ margin: '0 6px' }}>/</span>
            <span style={{ fontWeight: 600, color: '#222' }}>{selectedManager} Sourcing Manager</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Pantones</h1>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setPantoneSortAsc(v => !v)}
                style={{ padding: '8px 18px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}
              >
                {pantoneSortAsc ? 'Sort A-Z' : 'Sort Z-A'}
              </button>
              <button
                onClick={() => setShowComments(v => !v)}
                style={{ padding: '8px 18px', border: '1px solid #E5E7EB', borderRadius: 8, background: showComments ? '#E0E7FF' : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}
              >
                Comments
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative' }}>
            {/* Left: Pantone List */}
            <div style={{ width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001', border: '1px solid #E5E7EB', padding: 18, minHeight: 600 }}>
            <input
              type="text"
                placeholder="Search Pantone ID..."
              value={pantoneSearch}
              onChange={e => setPantoneSearch(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: '1px solid #E5E7EB',
                  width: '100%',
                  fontSize: 16,
                  marginBottom: 16,
                  background: '#F9FAFB',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {visiblePantones.map((rec) => (
                  <button
                    key={rec._id}
                    style={{
                      background: selectedRecord && selectedRecord._id === rec._id ? '#e6f0fa' : '#f7fafc',
                      borderRadius: 8,
                      padding: '12px 12px',
                      marginBottom: 6,
                      cursor: 'pointer',
                      border: selectedRecord && selectedRecord._id === rec._id ? '2px solid #1976d2' : '1px solid #e5e7eb',
                      fontWeight: selectedRecord && selectedRecord._id === rec._id ? 700 : 500,
                      fontSize: 15,
                      color: '#222',
                      textAlign: 'left',
                    }}
                    onClick={() => setSelectedRecord(rec)}
                  >
                    {rec.pantoneNumber || '-'}
                  </button>
                ))}
                {showMore && (
                  <div style={{ fontSize: 13, color: '#6B7280', padding: '4px 0' }}>+ {filteredPantones.length - 10} more</div>
                )}
              </div>
            </div>
            {/* Center: Details */}
            {selectedRecord && (
              <div style={{ flex: 1, background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001', border: '1px solid #E5E7EB', padding: 32, minWidth: 350, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 22 }}>{selectedRecord.pantoneNumber || '-'}</span>
                  {selectedRecord.season && (
                    <span style={{ marginLeft: 16, color: '#6B7280', fontWeight: 500 }}>{selectedRecord.season}</span>
                  )}
                </div>
                <div style={{ fontWeight: 500, fontSize: 17, marginBottom: 6 }}>{selectedRecord.name}</div>
                <div style={{ color: '#6B7280', fontSize: 15, marginBottom: 18 }}>
                  Submitted on: {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString() : '-'}<br />
                  Sourcing Manager: {selectedRecord.manager || '-'}
                </div>
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                {/* Comments Side Panel */}
                {showComments && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: 380,
                    height: '100vh',
                    background: '#fff',
                    boxShadow: '-2px 0 12px #0002',
                    zIndex: 100,
                    padding: 28,
                    overflowY: 'auto',
                    transition: 'right 0.3s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Comments</h2>
                      <button onClick={() => setShowComments(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
                    </div>
                    {/* Group comments by Pantone ID */}
                    {managerRecords && managerRecords.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {managerRecords.map((pantone, idx) => (
                          <div key={pantone._id || idx} style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 16, marginBottom: 6 }}>
                              {pantone.pantoneNumber || pantone._id || 'Pantone'}
                            </div>
                            {pantone.comments && pantone.comments.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {pantone.comments.map((c, cidx) => {
                                  const sender = c.user || c.sender || 'User';
                                  const message = c.text || c.message || '';
                                  return (
                                    <div key={cidx} style={{ background: '#F3F4F6', borderRadius: 8, padding: 12 }}>
                                      <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>{sender}</div>
                                      <div style={{ color: '#222', fontSize: 15 }}>{message}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ color: '#888', fontSize: 15 }}>No comments for this Pantone.</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#888', fontSize: 15 }}>No comments for this manager.</div>
                    )}
                  </div>
                )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Lab Dips</div>
                    {(selectedRecord && (selectedRecord.file || selectedRecord.s3Key || selectedRecord.image || selectedRecord.imageUrl)) ? (
                      <div style={{ position: 'relative', width: 320, height: 400, border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={selectedRecord.imageUrl || `http://localhost:3001/api/pantones/${selectedRecord._id}/image`}
                          alt={selectedRecord.pantoneNumber}
                          style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', borderRadius: 8 }}
                          onError={(e) => { 
                            console.error('Image failed to load:', e.target.src);
                            e.currentTarget.style.display = 'none'; 
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ color: '#6B7280', fontSize: 15 }}>No Lab Dip</div>
                    )}
                  </div>
                  <div style={{ flex: 1, marginLeft: 24 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Pantone Details</div>
                    <div style={{ fontSize: 15, color: '#374151', marginBottom: 8 }}><b>Pantone Number:</b> {selectedRecord.pantoneNumber || '-'}</div>
                    <div style={{ fontSize: 15, color: '#374151', marginBottom: 8 }}><b>Season:</b> {selectedRecord.season || '-'}</div>
                    <div style={{ fontSize: 15, color: '#374151', marginBottom: 8 }}><b>Submitted on:</b> {selectedRecord.createdAt ? new Date(selectedRecord.createdAt).toLocaleString() : '-'}</div>
                    <div style={{ fontSize: 15, color: '#374151', marginBottom: 8 }}><b>Sourcing Manager:</b> {selectedRecord.manager || '-'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Manager cards ---
  if (loading) {
    return (
      <div style={{ background: '#F7F8FA', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="60" height="60" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#3b82f6" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
        <h2 style={{ fontWeight: 700, fontSize: 22, margin: '16px 0 8px 0' }}>Loading Pantones...</h2>
      </div>
    );
  }
  if (!managerGroups || managerGroups.length === 0) {
    return (
      <div style={{ background: '#F7F8FA', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="80" height="80" fill="none" stroke="#CBD5E1" strokeWidth="6" viewBox="0 0 64 64">
          <circle cx="28" cy="28" r="18" />
          <line x1="44" y1="44" x2="60" y2="60" />
        </svg>
        <h2 style={{ fontWeight: 700, fontSize: 22, margin: '16px 0 8px 0' }}>No Pantones Found</h2>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 24 }}>No Pantone data available. Please check your database or upload new records.</p>
      </div>
    );
  }
  return (
    <div style={{ background: '#F7F8FA', minHeight: '100vh', padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 0 16px 0' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Pantones</h1>
        <p style={{ color: '#6B7280', fontSize: 16, marginBottom: 24 }}>Track the status and progress of the Pantones</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {managerGroups.map(m => (
            <div
              key={m.manager}
              style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 8px #0001',
                border: '1px solid #E5E7EB',
                padding: 24,
                minHeight: 140,
                minWidth: 320,
                maxWidth: 340,
                width: 340,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                marginBottom: 0,
                position: 'relative',
              }}
              onClick={() => {
                setSelectedManager(m.manager);
                const records = allRecords.filter(r => (r.manager || 'Unknown') === m.manager);
                setManagerRecords(records);
                setSelectedRecord(records[0]);
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px #0002'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px #0001'}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ background: '#E0E7FF', padding: 8, borderRadius: 8, marginRight: 12 }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#e0e7ff"/><rect x="7" y="7" width="10" height="10" rx="2" fill="#3b82f6"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#fff"/></svg>
                </div>
                <span style={{ fontWeight: 600, fontSize: 16, color: '#222', flex: 1 }}>{m.manager}</span>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ marginLeft: 8 }}><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Lab Dips</div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{m.count}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>Submitted On</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{m.lastDate ? new Date(m.lastDate).toLocaleDateString('en-GB') : '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pantone;