// src/formSchemas.js

export const customerFormSchema = [
  {
    key: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
    order: 1,
  },
  // Address fields
  {
    key: "addressLine1",
    label: "Address Line 1",
    type: "text",
    required: true,
    order: 2,
  },
  {
    key: "addressLine2",
    label: "Address Line 2",
    type: "text",
    required: false,
    order: 3,
  },
  {
    key: "city",
    label: "City",
    type: "text",
    required: true,
    order: 4,
  },
  {
    key: "state",
    label: "State/Province/Region",
    type: "text",
    required: true,
    order: 5,
  },
  {
    key: "postalCode",
    label: "Postal Code",
    type: "text",
    required: true,
    order: 6,
  },
  {
    key: "country",
    label: "Country",
    type: "text",
    required: true,
    order: 7,
  },
  {
    key: "companyPhone",
    label: "Company Phone Number",
    type: "tel",
    required: true,
    order: 8,
  },
  {
    key: "contactName",
    label: "Contact Name",
    type: "text",
    required: true,
    order: 9,
  },
  {
    key: "contactPhone",
    label: "Contact Phone Number",
    type: "tel",
    required: true,
    order: 10,
  },
  // Optional Billing Address
  {
    key: "billingAddress",
    label: "Billing Address",
    type: "textarea",
    required: false,
    order: 11,
  },
  // Optional Shipping Address
  {
    key: "shippingAddress",
    label: "Shipping Address",
    type: "textarea",
    required: false,
    order: 12,
  },
  {
    key: "notes",
    label: "Notes",
    type: "textarea",
    required: false,
    order: 13,
  },
];

export const ticketFormSchema = [
  {
    key: "companyName",
    label: "Company Name",
    type: "text",
    required: true,
    order: 1,
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    required: true,
    order: 2,
    options: ["New", "In Progress", "Completed"]
  },
  {
    key: "item",
    label: "Item",
    type: "text",
    required: true,
    order: 3,
  },
  {
    key: "reason",
    label: "Reason for Return",
    type: "textarea",
    required: true,
    order: 4,
  },
  {
    key: "technicianNotes",
    label: "Technician Notes",
    type: "textarea",
    required: false,
    order: 5,
  },
];
