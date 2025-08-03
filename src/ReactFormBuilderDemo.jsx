import React, { useState } from "react";
import { ReactFormBuilder } from "react-form-builder2";
import "react-form-builder2/dist/app.css";

const initialData = [
  {
    key: "TextInput",
    name: "Text Input",
    label: "Customer Name",
    required: false,
  },
  {
    key: "TextInput",
    name: "Text Input",
    label: "Ticket ID",
    required: false,
  },
  {
    key: "Dropdown",
    name: "Dropdown",
    label: "Status",
    options: ["Open", "In Progress", "Closed"],
    required: false,
  },
];

function ReactFormBuilderDemo() {
  const [formData, setFormData] = useState(initialData);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 min-h-[80vh]">
      <div className="md:w-1/2 w-full bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-blue-700">Drag & Drop Form Builder (Admin)</h2>
        <ReactFormBuilder
          data={formData}
          onPost={setFormData}
        />
      </div>
      <div className="md:w-1/2 w-full bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-green-700">Live Test Form Preview</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ReactFormBuilderDemo;
