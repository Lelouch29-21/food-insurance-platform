import { useState } from 'react';
import api from '../api/client';

export default function AdminPage() {
  const [credentials, setCredentials] = useState({ email: 'admin@demo.com', password: 'Admin@12345' });
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    try {
      await api.post('/auth/login', credentials);
      const { data } = await api.get('/insurance/adjustments');
      setLogs(data.logs || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load logs');
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="panel space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Adjustments</h1>
          <p className="text-sm text-slate-600">Authenticate and inspect recent interest adjustment events.</p>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <input
            value={credentials.email}
            onChange={(e) => setCredentials((s) => ({ ...s, email: e.target.value }))}
            className="field"
            placeholder="Admin Email"
          />
          <input
            value={credentials.password}
            onChange={(e) => setCredentials((s) => ({ ...s, password: e.target.value }))}
            type="password"
            className="field"
            placeholder="Password"
          />
          <button onClick={loadLogs} className="btn-primary">
            Load Logs
          </button>
        </div>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      </div>

      <div className="mt-6 space-y-3">
        {!logs.length && !error && <div className="panel text-slate-600">No logs loaded yet.</div>}
        {logs.map((log) => (
          <article key={log._id} className="panel">
            <div className="grid gap-3 md:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Adjustment</p>
                <p className="text-lg font-bold text-blue-800">{log.adjustment}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">User</p>
                <p className="font-semibold text-slate-800">{log.userId?.email || 'n/a'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500">Reason</p>
                <p className="text-sm text-slate-700">{log.reason}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
