
import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from './store';
import { useParams, useNavigate } from 'react-router-dom';
import { generateRmaNumber } from './rmaUtils';
import DynamicForm from './DynamicForm';
import { ticketFormSchema, ticketFieldGroups } from './formSchemas';
import { formatPhoneNumber } from './phoneFormat';

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
    reason: ticket?.reason || '',
    technicianNotes: ticket?.technicianNotes || '',
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

  function handleDynamicFormSubmit(values) {
    setError('');
    setMsg('');
    setLoading(true);
    setTimeout(() => {
      const updated = { ...ticket, ...values };
      // If status is set to Completed, set completedAt if not already set
      if (values.status === 'Completed' && !ticket.completedAt) {
        updated.completedAt = new Date().toISOString();
      }
      // If status is not Completed, clear completedAt
      if (values.status !== 'Completed') {
        updated.completedAt = undefined;
      }
      setTickets(tickets.map(t => t.id === ticket.id ? updated : t));
      setMsg('Ticket updated!');
      setLoading(false);
      setEditMode(false);
    }, 600); // Simulate async save
  }

  // Always use the stored RMA number; only generate if truly missing (old ticket)
  const rmaNumber = ticket.rmaNumber || (ticket.rmaNumber === undefined ? generateRmaNumber() : undefined);

  if (editMode) {
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
          <div className="mb-2">
            <span className="font-semibold">Customer:</span> {
              fallbackCustomer?.companyName
              || fallbackCustomer?.businessName
              || fallbackCustomer?.contactName
              || fallbackCustomer?.id
              || 'Unknown'
            }
          </div>
          <DynamicForm
            schema={ticketFormSchema}
            initialValues={form}
            onSubmit={handleDynamicFormSubmit}
          />
          {msg && <div className="text-green-700 mt-2" role="status">{msg}</div>}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </div>
    );
  }

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
        <div className="mb-2 text-gray-700">Customer: <span className="font-semibold">{
          fallbackCustomer?.companyName
          || fallbackCustomer?.businessName
          || fallbackCustomer?.contactName
          || fallbackCustomer?.id
          || 'Unknown'
        }</span></div>
        {/* Grouped fields */}
        {ticketFieldGroups.map(group => (
          <div key={group.label} className={`mb-4 p-3 rounded ${group.color}`}>
            <div className="font-bold mb-2 text-sm uppercase tracking-wide text-gray-700">{group.label}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {group.fields.map(fieldName => {
                const f = ticketFormSchema.find(f => f.name === fieldName);
                if (!f) return null;
                let value = ticket[f.name] || '';
                if (f.type === 'tel') {
                  value = formatPhoneNumber(value, ticket[`${f.name}_country`] || 'US');
                  // If extension field exists, append it
                  const extField = f.name + 'Ext';
                  if (ticket[extField]) {
                    value = value + ` x${ticket[extField]}`;
                  }
                }
                if (f.type === 'date' && value) {
                  value = new Date(value).toLocaleDateString();
                }
                return (
                  <div key={f.name}>
                    <span className="font-semibold">{f.label}:</span> {value || <span className="text-gray-400">—</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* Ungrouped fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          {ticketFormSchema
            .filter(f => f.type !== 'hidden' && !ticketFieldGroups.some(g => g.fields.includes(f.name)))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(f => {
              let value = ticket[f.name] || '';
              if (f.type === 'tel') {
                value = formatPhoneNumber(value, ticket[`${f.name}_country`] || 'US');
                // If extension field exists, append it
                const extField = f.name + 'Ext';
                if (ticket[extField]) {
                  value = value + ` x${ticket[extField]}`;
                }
              }
              if (f.type === 'date' && value) {
                value = new Date(value).toLocaleDateString();
              }
              return (
                <div key={f.name}>
                  <span className="font-semibold">{f.label}:</span> {value || <span className="text-gray-400">—</span>}
                </div>
              );
            })}
        </div>
        <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded">Edit / Update</button>
        {msg && <div className="text-green-700 mt-2" role="status">{msg}</div>}
      </div>
    </div>
  );
}
