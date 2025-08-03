import React, { useRef, useState } from 'react';
import { useAppStore } from './store';
import { formatPhoneNumber } from './phoneFormat';
import { useNavigate, useLocation } from 'react-router-dom';
import { customerFormSchema } from './formSchemas';

export default function CustomersListPage() {
  const customersRaw = useAppStore(s => s.customers);
  const setCustomers = useAppStore(s => s.setCustomers);
  const region = useAppStore(s => s.region || 'US');
  const customers = Array.isArray(customersRaw) ? customersRaw : [];
  const [query, setQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(() => Object.fromEntries(customerFormSchema.map(f => [f.name, ''])));
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRefs = useRef({});

  React.useEffect(() => {
    if (location.state && location.state.add) {
      setShowAddForm(true);
    } else {
      setShowAddForm(false);
    }
  }, [location.state]);

  // Alphabetize and group by first letter
  const filtered = customers
    .filter(c => {
      const company = (c.companyName ?? c.businessName ?? '') + '';
      const contact = (c.contactName ?? '') + '';
      const phone = (c.contactPhone ?? '') + '';
      const email = (c.contactEmail ?? '') + '';
      const q = (query ?? '') + '';
      return (
        company.toLowerCase().includes(q.toLowerCase()) ||
        contact.toLowerCase().includes(q.toLowerCase()) ||
        phone.includes(q) ||
        email.toLowerCase().includes(q.toLowerCase())
      );
    })
    .sort((a, b) => {
      const nameA = (a.companyName || a.businessName || '').toLowerCase();
      const nameB = (b.companyName || b.businessName || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

  // Group by first letter
  const grouped = {};
  filtered.forEach(c => {
    const name = (c.companyName || c.businessName || '').trim();
    const letter = name ? name[0].toUpperCase() : '#';
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });
  const letters = Object.keys(grouped).sort();

  // All possible A-Z plus #
  const allLetters = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).concat('#');

  // Scroll to section
  const handleJump = (letter) => {
    if (sectionRefs.current[letter]) {
      sectionRefs.current[letter].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  function handleAddClick() {
    setShowAddForm(true);
    navigate('/customers', { state: { add: true } });
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    // If field is a phone number, format it
    const phoneFields = ['companyPhone', 'contactPhone'];
    let newValue = value;
    if (phoneFields.includes(name)) {
      newValue = formatPhoneNumber(value, region);
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    // Assign id and slug
    const nanoid = (window.crypto?.randomUUID || (() => Math.random().toString(36).slice(2, 10)));
    const id = typeof nanoid === 'function' ? nanoid() : nanoid;
    const slug = (formData.companyName || formData.businessName || 'customer').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const newCustomer = { ...formData, id, slug };
    setCustomers(prev => Array.isArray(prev) ? [...prev, newCustomer] : [newCustomer]);
    setShowAddForm(false);
    setFormData(Object.fromEntries(customerFormSchema.map(f => [f.name, ''])));
    navigate('/customers');
  }

  function handleCancel() {
    setShowAddForm(false);
    setFormData(Object.fromEntries(customerFormSchema.map(f => [f.name, ''])));
    navigate('/customers');
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        {!showAddForm && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            onClick={handleAddClick}
          >
            + Add New Customer
          </button>
        )}
      </div>
      {!showAddForm && (
        <>
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Search by business, contact, phone, or email..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {/* Jump bar */}
          <div className="flex flex-wrap gap-1 mb-4 justify-center">
            {allLetters.map(letter => (
              <button
                key={letter}
                className={`px-2 py-1 rounded text-xs font-bold ${letters.includes(letter) ? 'bg-blue-200 text-blue-900 hover:bg-blue-400 hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                onClick={() => letters.includes(letter) && handleJump(letter)}
                disabled={!letters.includes(letter)}
                type="button"
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="bg-white rounded shadow">
            {letters.length === 0 && <div className="p-4 text-gray-500">No customers found.</div>}
            {letters.map(letter => (
              <div key={letter} ref={el => (sectionRefs.current[letter] = el)}>
                <div className="bg-gray-100 px-4 py-2 font-bold text-blue-700 sticky top-0 z-10 border-b border-gray-200">{letter}</div>
                {grouped[letter].map(c => (
                  <div key={c.id} className="p-4 flex justify-between items-center hover:bg-blue-50 cursor-pointer border-b last:border-b-0" onClick={() => navigate(`/customers/${c.slug}`)}>
                    <div>
                      <div className="font-semibold">{c.companyName || c.businessName || '(No Company Name)'}</div>
                      <div className="text-sm text-gray-600">{c.contactName} | {formatPhoneNumber(c.contactPhone, c.contactPhone_country || 'US')}{c.contactPhoneExt ? ` x${c.contactPhoneExt}` : ''}</div>
                    </div>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
      {showAddForm && (
        <form className="bg-white rounded shadow p-6 max-w-2xl mx-auto" onSubmit={handleFormSubmit}>
          <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Company Details Group */}
            <div className="rounded-lg p-4 bg-blue-50 border border-blue-100">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Company Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="companyName">Company Name</label>
                  <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={64} required minLength={2} placeholder="Company Name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="addressLine1">Address Line 1</label>
                    <input id="addressLine1" type="text" name="addressLine1" value={formData.addressLine1} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={128} required minLength={2} placeholder="Address Line 1" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="addressLine2">Address Line 2</label>
                    <input id="addressLine2" type="text" name="addressLine2" value={formData.addressLine2} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={128} placeholder="Address Line 2 (Optional)" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="city">City</label>
                    <input id="city" type="text" name="city" value={formData.city} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={64} required minLength={2} placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="state">State/Province/Region</label>
                    <input id="state" type="text" name="state" value={formData.state} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={64} required minLength={2} placeholder="State/Province/Region" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="postalCode">Postal Code</label>
                    <input id="postalCode" type="text" name="postalCode" value={formData.postalCode} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={16} required minLength={2} placeholder="Postal Code" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="country">Country</label>
                    <input id="country" type="text" name="country" value={formData.country} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={64} required minLength={2} placeholder="Country" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="companyPhone">Company Phone</label>
                    <input id="companyPhone" type="tel" name="companyPhone" value={formatPhoneNumber(formData.companyPhone, region)} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={16} required placeholder={region === 'US' ? '(555) 123-4567' : '+44 20 7946 0958'} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="companyPhoneExt">Ext <span className="text-gray-400">(Optional)</span></label>
                    <input id="companyPhoneExt" type="text" name="companyPhoneExt" value={formData.companyPhoneExt} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={8} placeholder="Ext. (Optional)" />
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Details Group */}
            <div className="rounded-lg p-4 bg-green-50 border border-green-100">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Contact Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="contactName">Contact Name</label>
                  <input id="contactName" type="text" name="contactName" value={formData.contactName} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={64} required minLength={2} placeholder="Full Name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="contactPhone">Contact Phone</label>
                    <input id="contactPhone" type="tel" name="contactPhone" value={formatPhoneNumber(formData.contactPhone, region)} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={16} required placeholder={region === 'US' ? '(555) 123-4567' : '+44 20 7946 0958'} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" htmlFor="contactPhoneExt">Ext <span className="text-gray-400">(Optional)</span></label>
                    <input id="contactPhoneExt" type="text" name="contactPhoneExt" value={formData.contactPhoneExt} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={8} placeholder="Ext. (Optional)" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="contactEmail">Email</label>
                  <input id="contactEmail" type="email" name="contactEmail" value={formData.contactEmail} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={128} required placeholder="Email address" />
                </div>
              </div>
            </div>
            {/* Billing, Shipping, Notes (not grouped) */}
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="billingAddress">Billing Address</label>
              <textarea id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={256} placeholder="Billing Address" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="shippingAddress">Shipping Address</label>
              <textarea id="shippingAddress" name="shippingAddress" value={formData.shippingAddress} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={256} placeholder="Shipping Address" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="notes">Notes</label>
              <textarea id="notes" name="notes" value={formData.notes} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={512} placeholder="Notes (Optional)" />
            </div>
            {/* Render any remaining fields from schema except those already rendered above */}
            {customerFormSchema
              .filter(f => !['companyName','addressLine1','addressLine2','city','state','postalCode','country','companyPhone','companyPhoneExt','contactName','contactPhone','contactPhoneExt','contactEmail','billingAddress','shippingAddress','notes'].includes(f.name) && f.type !== 'hidden')
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(f => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={f.name}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea id={f.name} name={f.name} value={formData[f.name]} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={f.maxLength} required={f.required} placeholder={f.placeholder || ''} />
                  ) : (
                    <input id={f.name} type={f.type} name={f.name} value={formData[f.name]} onChange={handleFormChange} className="w-full border p-2 rounded" maxLength={f.maxLength} required={f.required} minLength={f.minLength} placeholder={f.placeholder || ''} />
                  )}
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}
