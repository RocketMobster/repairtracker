import React from "react";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { Model } from "survey-core";

const surveyJson = {
  title: "Customer Form Demo",
  description: "Drag and drop fields in the SurveyJS Builder (admin only)",
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "customerName", title: "Customer Name" },
        { type: "text", name: "phone", title: "Phone Number" },
        { type: "dropdown", name: "region", title: "Region", choices: ["US", "UK"] },
        { type: "comment", name: "notes", title: "Notes" }
      ]
    }
  ]
};

export default function SurveyJSDemo() {
  const survey = new Model(surveyJson);
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <h2 className="text-2xl font-bold mb-4">SurveyJS Form Demo</h2>
      <Survey model={survey} />
      <p className="mt-4 text-gray-600">This is a demo of SurveyJS form rendering. For drag-and-drop builder, see SurveyJS documentation for the <a href='https://surveyjs.io/form-builder/documentation/react' target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>SurveyJS Form Builder</a>.</p>
    </div>
  );
}
