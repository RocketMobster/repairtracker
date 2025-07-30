import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from './store';
import { useParams, useNavigate } from 'react-router-dom';
import { generateRmaNumber } from './rmaUtils';

export default function TicketDetails() {
  const { customerId: customerSlug, ticketId } = useParams();
  const navigate = useNavigate();
  const tickets = useAppStore(s => s.tickets);
  const customers = useAppStore(s => s.customers);
  const setTickets = useAppStore(s => s.setTickets);
  const customer = customers.find(c => c.slug === customerSlug);
  // If customer not found, try to find by ticket.customerId
  let ticket = tickets.find(t => String(t.id) === String(ticketId) && customer && t.customerId === customer.id);
  let fallbackCustomer = customer;
  if (!ticket && tickets.length > 0) {
    ticket = tickets.find(t => String(t.id) === String(ticketId));
    if (ticket) {
      fallbackCustomer = customers.find(c => c.id === ticket.customerId);
    }
  }
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    status: ticket?.status || '',
    item: ticket?.item || '',
    notes: ticket?.notes || '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const itemInputRef = useRef(null);
  // Track if form is dirty (has unsaved changes)
  const isDirty = editMode && ticket && (
    form.status !== (ticket.status || '') ||
    form.item !== (ticket.item || '') ||
    form.notes !== (ticket.notes || '')
  );

  // Auto-focus first field in edit mode
  useEffect(() => {
    if (editMode && itemInputRef.current) {
      itemInputRef.current.focus();
    }
  }, [editMode]);

  if (!ticket || !fallbackCustomer) {
    return <div className="p-4 text-red-600">Ticket or customer not found.</div>;
  }

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
    // Fallback: generate RMA number if missing (for old tickets)
    const rmaNumber = ticket.rmaNumber || generateRmaNumber();
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white p-4 rounded shadow">
          <button
            className="text-blue-600 underline mb-2"
            onClick={() => navigate(`/customers/${fallbackCustomer.slug}`)}
            tabIndex={0}
          >&larr; Back to Customer</button>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold">Edit RMA #{rmaNumber}</div>
            <div className="text-xs text-gray-400 ml-2">Ticket ID: {ticket.id}</div>
          </div>
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
              <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => navigate(`/customers/${customer.slug}`)} disabled={loading}>Cancel</button>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
          {msg && <div className="text-green-700 mt-2" role="status">{msg}</div>}
        </div>
      </div>
    );
  }

  // Fallback: generate RMA number if missing (for old tickets)
  const rmaNumber = ticket.rmaNumber || generateRmaNumber();
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white p-4 rounded shadow">
        <button
          className="text-blue-600 underline mb-2"
          onClick={() => navigate(fallbackCustomer ? `/customers/${fallbackCustomer.slug}` : '/customers')}
          tabIndex={0}
        >&larr; Back to Customer</button>
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold">RMA #{rmaNumber}</div>
          <div className="text-xs text-gray-400 ml-2">Ticket ID: {ticket.id}</div>
        </div>
        <div className="mb-2 text-gray-700">Customer: <span className="font-semibold">{fallbackCustomer.businessName}</span></div>
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
    </div>
  );
}
