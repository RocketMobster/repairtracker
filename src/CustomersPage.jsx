import React, { useState } from 'react';
import { useAppStore } from './store';
import { useNavigate } from 'react-router-dom';

function CustomerForm({ onSave, initial = {}, isEdit }) {
  const [form, setForm] = useState({
    businessName: initial.businessName || '',
    contactName: initial.contactName || '',
    contactPhone: initial.contactPhone || '',
    contactEmail: initial.contactEmail || '',
    billingAddress: initial.billingAddress || '',
    shippingAddress: initial.shippingAddress || '',
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation
    if (!form.businessName || !form.contactName || !form.contactPhone || !form.contactEmail) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onSave(form);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold">Business Name*</label>
          <input name="businessName" value={form.businessName} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Contact Name*</label>
          <input name="contactName" value={form.contactName} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Contact Phone*</label>
          <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Contact Email*</label>
          <input name="contactEmail" value={form.contactEmail} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block font-semibold">Billing Address</label>
          <input name="billingAddress" value={form.billingAddress} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Shipping Address</label>
          <input name="shippingAddress" value={form.shippingAddress} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{isEdit ? 'Save Changes' : 'Create & New Repair Ticket'}</button>
      </div>
    </form>
  );
}

function CustomerSearch({ onSelect }) {
  const customers = useAppStore(s => s.customers);
  const [query, setQuery] = useState('');
  const results = customers.filter(c =>
    c.businessName.toLowerCase().includes(query.toLowerCase()) ||
    c.contactName.toLowerCase().includes(query.toLowerCase()) ||
    c.contactPhone.includes(query) ||
    c.contactEmail.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="mb-4">
      <input
        className="w-full border p-2 rounded mb-2"
        placeholder="Search by business, contact, phone, or email..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {query && (
        <div className="bg-white rounded shadow max-h-48 overflow-y-auto">
          {results.length === 0 && <div className="p-2 text-gray-500">No results</div>}
          {results.map(c => (
            <div key={c.id} className="p-2 border-b flex justify-between items-center hover:bg-blue-50 cursor-pointer" onClick={() => onSelect(c)}>
              <div>
                <div className="font-semibold">{c.businessName}</div>
                <div className="text-sm text-gray-600">{c.contactName} | {c.contactPhone}</div>
              </div>
              <button className="bg-blue-500 text-white px-2 py-1 rounded">Select</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomerDetails({ customer, onEdit, onNewTicket }) {
  const tickets = useAppStore(s => s.tickets);
  const customerTickets = tickets.filter(t => t.customerId === customer.id);
  const activeTickets = customerTickets.filter(t => t.status !== 'Completed');
  const completedTickets = customerTickets.filter(t => t.status === 'Completed');
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-bold">{customer.businessName}</div>
        <button onClick={onEdit} className="text-blue-600 underline">Edit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <div><span className="font-semibold">Contact:</span> {customer.contactName}</div>
        <div><span className="font-semibold">Phone:</span> {customer.contactPhone}</div>
        <div><span className="font-semibold">Email:</span> {customer.contactEmail}</div>
        <div><span className="font-semibold">Billing Address:</span> {customer.billingAddress}</div>
        <div><span className="font-semibold">Shipping Address:</span> {customer.shippingAddress}</div>
      </div>
      <button onClick={onNewTicket} className="bg-green-600 text-white px-4 py-2 rounded mb-2">New Repair Ticket</button>
      <div className="mb-2">
        <span className="font-semibold">Active Tickets:</span> {activeTickets.length}
        {activeTickets.length > 0 && (
          <ul className="list-disc ml-6 mt-1">
            {activeTickets.map(t => (
              <li key={t.id} className="flex justify-between items-center">
                <span>#{t.id} - {t.status} ({t.item || 'Item'})</span>
                <button className="text-blue-600 underline ml-2" onClick={() => navigate(`/customers/${customer.slug}/tickets/${t.id}`)}>View Details</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <button className="text-gray-700 underline" onClick={() => setShowCompleted(v => !v)}>
          {completedTickets.length > 0 ? (showCompleted ? 'Hide Completed Tickets' : 'Show Completed Tickets') : 'No Completed Tickets'}
        </button>
        <div className="mt-1">
          {completedTickets.length > 0 && showCompleted && (
            <ul className="list-disc ml-6">
              {completedTickets.map(t => (
                <li key={t.id} className="flex justify-between items-center">
                  <span>#{t.id} - {t.item || 'Item'} (Completed {t.completedAt || ''})</span>
                  <button className="text-blue-600 underline ml-2" onClick={() => navigate(`/customers/${customer.id}/tickets/${t.id}`)}>View Details</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [mode, setMode] = useState('search'); // 'search', 'add', 'edit', 'details'
  const [selected, setSelected] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);
  const customers = useAppStore(s => s.customers);
  const setCustomers = useAppStore(s => s.setCustomers);
  const tickets = useAppStore(s => s.tickets);
  const setTickets = useAppStore(s => s.setTickets);
  const [ticketMsg, setTicketMsg] = useState("");
  const [addError, setAddError] = useState("");
  const navigate = useNavigate();

function handleAddCustomer(data) {
  // Prevent duplicate by businessName (case-insensitive, trimmed)
  const exists = customers.some(c => c.businessName.trim().toLowerCase() === data.businessName.trim().toLowerCase());
  if (exists) {
    setAddError('A customer with this business name already exists.');
    return;
  }
  setAddError("");
  const slug = slugify(data.businessName || data.companyName || 'customer');
  const newCustomer = { ...data, id: Date.now(), slug };
  const newTicket = {
    id: Date.now(),
    customerId: newCustomer.id,
    status: 'New',
    createdAt: new Date().toISOString(),
    item: '',
  };
  setCustomers([...customers, newCustomer]);
  setTickets([...tickets, newTicket]);
  setSelected(newCustomer);
  setTicketMsg('New repair ticket created for this customer!');
  setMode('details');
  setTimeout(() => {
    navigate(`/customers/${newCustomer.slug}/tickets/${newTicket.id}`);
  }, 0);
}
  function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  }
  function handleEditCustomer(data) {
    setCustomers(customers.map(c => c.id === editCustomer.id ? { ...editCustomer, ...data } : c));
    setSelected({ ...editCustomer, ...data });
    setEditCustomer(null);
    setMode('details');
  }
  function handleSelectCustomer(c) {
    setSelected(c);
    setMode('details');
  }
  function handleEditClick() {
    setEditCustomer(selected);
    setMode('edit');
  }
  function handleNewTicket() {
  if (!selected) return;
  const newTicket = {
    id: Date.now(),
    customerId: selected.id,
    status: 'New',
    createdAt: new Date().toISOString(),
    item: '',
  };
  setTickets([...tickets, newTicket]);
  setTicketMsg('New repair ticket created for this customer!');
  navigate(`/customers/${selected.slug}/tickets/${newTicket.id}`);
}
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button onClick={() => { setMode('search'); setSelected(null); setEditCustomer(null); }} className={`px-4 py-2 rounded ${mode === 'search' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Find Existing</button>
        <button onClick={() => { setMode('add'); setSelected(null); setEditCustomer(null); }} className={`px-4 py-2 rounded ${mode === 'add' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>Add New</button>
      </div>
      {mode === 'search' && <CustomerSearch onSelect={handleSelectCustomer} />}
      {mode === 'add' && (
        <>
          {addError && <div className="mb-2 text-red-600 bg-red-100 border border-red-300 rounded px-2 py-1 text-sm">{addError}</div>}
          <CustomerForm onSave={handleAddCustomer} />
        </>
      )}
      {mode === 'edit' && <CustomerForm onSave={handleEditCustomer} initial={editCustomer} isEdit />}
      {mode === 'details' && selected && (
        <>
          {ticketMsg && <div className="bg-green-100 text-green-800 p-2 mb-2 rounded">{ticketMsg}</div>}
          <CustomerDetails customer={selected} onEdit={handleEditClick} onNewTicket={handleNewTicket} />
        </>
      )}
    </div>
  );
}
