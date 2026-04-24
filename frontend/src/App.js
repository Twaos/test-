import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tooted, setTooted] = useState([]);
  const [vorm, setVorm] = useState({ nimi: '', hind: '', kogus: '' });

  const API_URL = "http://localhost:5000/api/tooted";

  useEffect(() => { laadiAndmed(); }, []);

  const laadiAndmed = async () => {
    try {
      const res = await axios.get(API_URL);
      setTooted(res.data);
    } catch (err) { console.error("Viga laadimisel:", err); }
  };

  const lisaToode = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, vorm);
      setVorm({ nimi: '', hind: '', kogus: '' });
      laadiAndmed();
    } catch (err) { console.error("Viga lisamisel:", err); }
  };

  const kustutaToode = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      laadiAndmed();
    } catch (err) { console.error("Viga kustutamisel:", err); }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Tootehaldus (MS SQL + React)</h1>
      <form onSubmit={lisaToode} style={{ marginBottom: '20px' }}>
        <input placeholder="Nimi" value={vorm.nimi} onChange={e => setVorm({...vorm, nimi: e.target.value})} required />
        <input placeholder="Hind" type="number" value={vorm.hind} onChange={e => setVorm({...vorm, hind: e.target.value})} required />
        <input placeholder="Kogus" type="number" value={vorm.kogus} onChange={e => setVorm({...vorm, kogus: e.target.value})} required />
        <button type="submit">Lisa</button>
      </form>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Nimi</th><th>Hind</th><th>Kogus</th><th>Tegevus</th>
          </tr>
        </thead>
        <tbody>
          {tooted.map(t => (
            <tr key={t.id}>
              <td>{t.nimi}</td><td>{t.hind}€</td><td>{t.kogus} tk</td>
              <td><button onClick={() => kustutaToode(t.id)}>Kustuta</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;