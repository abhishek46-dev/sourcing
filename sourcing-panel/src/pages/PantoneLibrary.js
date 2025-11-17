import React, { useEffect, useState } from 'react';
 
const PantoneLibrary = () => {
  const [pantones, setPantones] = useState([]);
  const [season, setSeason] = useState('SS 25');

  useEffect(() => {
    fetch('/api/pantone-libraries')
      .then(res => res.json())
      .then(data => {
        // Find the library for the selected season
        const library = data.find(lib => lib.season === season);
        setPantones(library ? library.pantones : []);
      });
  }, [season]);

  return (
    <div className="page  " style={{ background: '#F7F8FA', minHeight: '100vh', padding: 0 }}>
      <div style={{ padding: '32px 40px 0 40px' }}>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Pantone library</div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px #0001', padding: 24, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <input
              type="text"
              placeholder="Search Pantone.."
              style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 16, width: 220 }}
              // Add search logic if needed
            />
            <button style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 18px', fontWeight: 500, color: '#222', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              FILTER
            </button>
            <button style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 18px', fontWeight: 500, color: '#222', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              STATUS
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#6e6e73', fontSize: 14 }}>SEASON</span>
              <select value={season} onChange={e => setSeason(e.target.value)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 15 }}>
                <option>SS 25</option>
                <option>FW 25</option>
              </select>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Code</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Color name</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Color</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Pantone</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Added by</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 15 }}>Season</th>
                </tr>
              </thead>
              <tbody>
                {pantones.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 16px' }}>{p.pantoneNumber}</td>
                    <td style={{ padding: '12px 16px' }}>{p.colorName}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-block', width: 32, height: 24, borderRadius: 6, background: p.hex, border: '1px solid #E5E7EB' }}></span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{p.pantoneNumber}</td>
                    <td style={{ padding: '12px 16px' }}>Your Designer</td>
                    <td style={{ padding: '12px 16px' }}>{season}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pantones.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>No Pantones found for this season.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PantoneLibrary; 