import React, { useRef, useEffect } from 'react';
// Formio.js CDN for demo purposes
// In production, use npm install formiojs react-formio

const FORMIO_CDN = 'https://cdn.form.io/formiojs/formio.full.min.js';
const FORMIO_CSS = 'https://cdn.form.io/formiojs/formio.full.min.css';

export default function FormBuilderDemo() {
  const builderRef = useRef(null);

  useEffect(() => {
    // Load Formio.js script and CSS
    if (!window.Formio) {
      const script = document.createElement('script');
      script.src = FORMIO_CDN;
      script.async = true;
      document.body.appendChild(script);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = FORMIO_CSS;
      document.head.appendChild(link);
      script.onload = () => {
        window.Formio.builder(builderRef.current, {}, {});
        injectFormioCustomStyles();
      };
    } else {
      window.Formio.builder(builderRef.current, {}, {});
      injectFormioCustomStyles();
    }
    function injectFormioCustomStyles() {
      if (document.getElementById('formio-custom-css')) return;
      const style = document.createElement('style');
      style.id = 'formio-custom-css';
      style.innerHTML = `
        /* Sidebar field items */
        .formio-builder-sidebar .formio-builder-group .formio-builder-component {
          background: #e0e7ff;
          border-radius: 8px;
          margin: 6px 0;
          padding: 10px 16px;
          font-weight: 500;
          color: #1e3a8a;
          box-shadow: 0 1px 2px #0001;
          cursor: grab;
          border: 2px solid #c7d2fe;
          transition: background 0.2s, border 0.2s;
        }
        .formio-builder-sidebar .formio-builder-group .formio-builder-component:hover {
          background: #6366f1;
          color: #fff;
          border-color: #6366f1;
        }
        /* Sidebar container */
        .formio-builder-sidebar {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 12px;
        }
        /* Category headers (collapsible) */
        .formio-builder-sidebar .formio-builder-group-title {
          display: flex;
          align-items: center;
          font-size: 1.05rem;
          font-weight: 600;
          color: #374151;
          margin: 12px 0 4px 0;
          padding: 6px 10px;
          border-radius: 6px;
          background: #e0e7ff;
          cursor: pointer;
          position: relative;
        }
        .formio-builder-sidebar .formio-builder-group-title::before {
          content: '📂';
          display: inline-block;
          margin-right: 8px;
          font-size: 1.1em;
        }
        /* Open/active category header */
        .formio-builder-sidebar .formio-builder-group.open > .formio-builder-group-title {
          background: #6366f1;
          color: #fff;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Formio.js Form Builder Demo</h2>
      <div className="flex gap-8">
        {/* Formio Builder Sidebar and Builder */}
        <div className="w-[400px]">
          <div ref={builderRef} className="rounded-lg bg-gray-50 border border-gray-200 p-4" style={{ minHeight: 600 }} />
        </div>
        {/* Working Area */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6 border-2 border-blue-200 min-h-[600px]">
          <h3 className="font-semibold text-lg mb-6">Working Area</h3>
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded p-4 border border-blue-100">
                <h4 className="font-bold mb-2">Section 1</h4>
                <div className="min-h-[80px]">{/* Place fields here */}</div>
              </div>
              <div className="bg-blue-50 rounded p-4 border border-blue-100">
                <h4 className="font-bold mb-2">Section 2</h4>
                <div className="min-h-[80px]">{/* Place fields here */}</div>
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded p-4 border border-blue-100">
                <h4 className="font-bold mb-2">Section 3</h4>
                <div className="min-h-[80px]">{/* Place fields here */}</div>
              </div>
              <div className="bg-blue-50 rounded p-4 border border-blue-100">
                <h4 className="font-bold mb-2">Section 4</h4>
                <div className="min-h-[80px]">{/* Place fields here */}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600">This is a live demo of the Formio.js form builder. You can drag, drop, add, remove, and configure fields and groups. For full integration, use the <code>react-formio</code> package and persist schemas to your backend.</p>
    </div>
  );
}
