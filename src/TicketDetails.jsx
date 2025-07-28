import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from './store';

export default function TicketDetails({ ticket, forceEdit, onBack }) {
  const setTickets = useAppStore(s => s.setTickets);
  const tickets = useAppStore(s => s.tickets);
  const [editMode, setEditMode] = useState(!!forceEdit);
  const [form, setForm] = useState({
    status: ticket.status || '',
    item: ticket.item || '',
    notes: ticket.notes || '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const itemInputRef = useRef(null);
  // Track if form is dirty (has unsaved changes)
  const isDirty = editMode && (
    form.status !== (ticket.status || '') ||
    form.item !== (ticket.item || '') ||
    form.notes !== (ticket.notes || '')
  );

  useEffect(() => {
    if (forceEdit) setEditMode(true);
  }, [forceEdit]);

  // Auto-focus first field in edit mode
  useEffect(() => {
    if (editMode && itemInputRef.current) {
      itemInputRef.current.focus();
    }
  }, [editMode]);

  if (!ticket) return <div className="p-4">No ticket selected.</div>;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!form.status || !form.item) {
      setError('Status and Item are required.');
      if (!form.item && itemInputRef.current) itemInputRef.current.focus();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = { ...ticket, ...form };
      // If status is set to Completed, set completedAt if not already set
      if (form.status === 'Completed' && !ticket.completedAt) {
        updated.completedAt = new Date().toISOString();
      }
      // If status is not Completed, clear completedAt
      if (form.status !== 'Completed') {
        updated.completedAt = undefined;
      }
      setTickets(tickets.map(t => t.id === ticket.id ? updated : t));
      setMsg('Ticket updated!');
      setLoading(false);
      setEditMode(false);
    }, 600); // Simulate async save
  }

  if (editMode) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <button
          className="text-blue-600 underline mb-2"
          onClick={() => onBack(isDirty)}
          tabIndex={0}
        >&larr; Back to Customer</button>
        <div className="text-lg font-bold mb-2">Edit Ticket #{ticket.id}</div>
        <form onSubmit={handleSubmit} className="space-y-3" aria-label="Edit Ticket">
          <div>
            <label htmlFor="status" className="block font-semibold">Status<span className="text-red-500">*</span></label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded" required>
              <option value="">Select status</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label htmlFor="item" className="block font-semibold">Item<span className="text-red-500">*</span></label>
            <input id="item" name="item" value={form.item} onChange={handleChange} className="w-full border p-2 rounded" ref={itemInputRef} required />
          </div>
          <div>
            <label htmlFor="notes" className="block font-semibold">Notes</label>
            <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => onBack(isDirty)} disabled={loading}>Cancel</button>
          </div>
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </form>
        {msg && <div className="text-green-700 mt-2" role="status">{msg}</div>}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <button
        className="text-blue-600 underline mb-2"
        onClick={() => onBack(false)}
        tabIndex={0}
      >&larr; Back to Customer</button>
      <div className="text-lg font-bold mb-2">Ticket #{ticket.id}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <div><span className="font-semibold">Status:</span> {ticket.status}</div>
        <div><span className="font-semibold">Item:</span> {ticket.item || 'N/A'}</div>
        <div><span className="font-semibold">Created:</span> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}</div>
        <div><span className="font-semibold">Completed:</span> {ticket.completedAt ? new Date(ticket.completedAt).toLocaleString() : '—'}</div>
        <div className="md:col-span-2"><span className="font-semibold">Notes:</span> {ticket.notes || '—'}</div>
      </div>
      <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit / Update</button>
      {msg && <div className="text-green-700 mt-2" role="status">{msg}</div>}
    </div>
  );
}
