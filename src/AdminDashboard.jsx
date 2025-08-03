
import React from 'react';
import { useAppStore } from './store';

export default function AdminDashboard() {
  const region = useAppStore(s => s.region || 'US');
  const setRegion = useAppStore(s => s.setRegion);

  function handleRegionChange(e) {
    setRegion(e.target.value);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Phone Number Format (Region)</label>
        <select value={region} onChange={handleRegionChange} className="border p-2 rounded">
          <option value="US">United States (US)</option>
          <option value="UK">United Kingdom (UK)</option>
        </select>
        <div className="text-xs text-gray-500 mt-2">Controls phone number formatting for all customer forms.</div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Field Group/Schema Editor</h2>
          <p className="text-gray-600 text-sm">Configure forms and details views for customers and tickets.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Settings Panel</h2>
          <p className="text-gray-600 text-sm">Manage PWA, Kanban, and ticket status settings.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Audit Log Viewer</h2>
          <p className="text-gray-600 text-sm">View logs of customer/ticket changes and admin actions.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Help/Tooltip Editor</h2>
          <p className="text-gray-600 text-sm">Manage context help and tooltips content.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">User Management (stub)</h2>
          <p className="text-gray-600 text-sm">Manage users and roles (coming soon).</p>
        </div>
      </div>
    </div>
  );
}
