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
      setLogs(data.logs);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load logs');
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="panel space-y-3">
        <h1 className="text-2xl font-bold">Admin Adjustments</h1>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            value={credentials.email}
            onChange={(e) => setCredentials((s) => ({ ...s, email: e.target.value }))}
            className="rounded-lg border px-3 py-2"
            placeholder="Admin Email"
          />
          <input
            value={credentials.password}
            onChange={(e) => setCredentials((s) => ({ ...s, password: e.target.value }))}
            type="password"
            className="rounded-lg border px-3 py-2"
            placeholder="Password"
          />
          <button onClick={loadLogs} className="rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white">
            Load Logs
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-6 space-y-3">
        {logs.map((log) => (
          <article key={log._id} className="panel">
            <p className="font-semibold text-blue-900">Adjustment: {log.adjustment}%</p>
            <p className="text-sm text-slate-600">Reason: {log.reason}</p>
            <p className="text-xs text-slate-500">User: {log.userId?.email || 'n/a'}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
