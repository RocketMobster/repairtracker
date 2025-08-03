import React, { useState } from "react";
import "survey-core/survey-core.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { Survey } from "survey-react-ui";
// import removed, see below for combined import
import { Model } from "survey-core";

const initialSchema = {
  title: "Test Form",
  description: "This is a live preview of your form.",
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "customerName", title: "Customer Name" },
        { type: "text", name: "ticketId", title: "Ticket ID" },
        { type: "dropdown", name: "status", title: "Status", choices: ["Open", "In Progress", "Closed"] }
      ]
    }
  ]
};

// ...existing imports and initialSchema...


import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";

function SurveyJSBuilderDemo() {
  const [formSchema, setFormSchema] = useState(initialSchema);
  const [creator] = useState(() => {
    const c = new SurveyCreator();
    c.JSON = initialSchema;
    return c;
  });

  React.useEffect(() => {
    creator.JSON = formSchema;
  }, [formSchema, creator]);

  React.useEffect(() => {
    creator.onModified.add(() => {
      setFormSchema({ ...creator.JSON });
    });
    return () => {
      creator.onModified.clear();
    };
  }, [creator]);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 min-h-[80vh]">
      <div className="md:w-1/2 w-full bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-blue-700">Drag & Drop Form Builder (Admin)</h2>
        <SurveyCreatorComponent creator={creator} showLogicTab={true} />
      </div>
      <div className="md:w-1/2 w-full bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2 text-green-700">Live Test Form Preview</h2>
        <Survey model={new Model(formSchema)} />
      </div>
    </div>
  );
}

export default SurveyJSBuilderDemo;
