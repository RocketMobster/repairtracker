import { defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
// Simple icon mapping for field types
const FIELD_TYPE_ICONS = {
  text: '📝',
  textarea: '📄',
  number: '🔢',
  date: '📅',
  dropdown: '⬇️',
  checkbox: '☑️',
  radio: '🔘',
};
export function SortableField({ id, field, idx, activeId, onRemove, onUpdate, setActiveId, isDropTarget, nodeRef = { current: null }, highlight }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges: defaultAnimateLayoutChanges,
    handle: true,
  });
  // Use safeNodeRef everywhere, defaulting to a no-op ref if nodeRef is undefined
  const safeNodeRef = nodeRef ?? { current: null };
  const combinedRef = el => {
    setNodeRef(el);
    safeNodeRef.current = el;
  };
  return (
    <div
      ref={combinedRef}
      {...attributes}
      className={`mb-2 p-2 border rounded flex flex-col gap-2 bg-white transition-all duration-300 ease-in-out opacity-100 translate-y-0 ${isDragging ? 'ring-2 ring-blue-400' : ''} ${isDropTarget ? 'ring-4 ring-blue-300 bg-blue-50' : ''} touch-manipulation${highlight ? ' field-highlight' : ''}`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: `${transition}, opacity 0.3s, transform 0.3s`,
        touchAction: 'manipulation',
      }}
    >
      <div className="flex items-center gap-2">
        {/* Drag handle with tooltip - now first/top-left */}
        <span
          {...listeners}
          data-dnd-kit-handle
          className="cursor-grab text-gray-400 hover:text-blue-500 mr-1 select-none relative"
          tabIndex={0}
          style={{
            minWidth: '2.5rem',
            minHeight: '2.5rem',
            fontSize: '1.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'manipulation',
            background: '#fffde7', // lighter yellow
            border: '2px solid #fbbf24',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            const tip = document.createElement('div');
            tip.textContent = 'Drag to reorder';
            tip.className = 'absolute left-8 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow z-10 whitespace-nowrap';
            tip.style.pointerEvents = 'none';
            tip.id = 'drag-tooltip';
            e.currentTarget.appendChild(tip);
          }}
          onMouseLeave={e => {
            const tip = e.currentTarget.querySelector('#drag-tooltip');
            if (tip) tip.remove();
          }}
        >
          &#x2630;
        </span>
        {/* Field type icon - now after drag handle */}
        <span className="text-xl mr-1" title={field.type} aria-label={field.type}>
          {FIELD_TYPE_ICONS[field.type] || '❓'}
        </span>
        <select
          value={field.type}
          onChange={e => onUpdate(field.id, { type: e.target.value })}
          className="border rounded px-2 py-1"
        >
          {FIELD_TYPES.map(ft => (
            <option key={ft.type} value={ft.type}>{ft.label}</option>
          ))}
        </select>
        {/* Field label editor */}
        <input
          type="text"
          value={field.label}
          onChange={e => onUpdate(field.id, { label: e.target.value })}
          placeholder={`Field ${idx + 1}`}
          className="flex-1 border rounded px-2 py-1 ml-2"
        />
        <button onClick={() => onRemove(field.id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
      </div>
      {/* Field config options */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={field.config?.required || false}
            onChange={e => onUpdate(field.id, { config: { ...field.config, required: e.target.checked } })}
          />
          Required
        </label>
        {(field.type === 'text' || field.type === 'textarea' || field.type === 'number') && (
          <input
            type="text"
            value={field.config?.placeholder || ''}
            onChange={e => onUpdate(field.id, { config: { ...field.config, placeholder: e.target.value } })}
            placeholder="Placeholder"
            className="border rounded px-2 py-1"
          />
        )}
        {(field.type === 'text' || field.type === 'textarea') && (
          <>
            <input
              type="number"
              value={field.config?.minLength || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, minLength: Number(e.target.value) } })}
              placeholder="Min Length"
              className="border rounded px-2 py-1 w-24"
            />
            <input
              type="number"
              value={field.config?.maxLength || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, maxLength: Number(e.target.value) } })}
              placeholder="Max Length"
              className="border rounded px-2 py-1 w-24"
            />
            <input
              type="text"
              value={field.config?.pattern || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, pattern: e.target.value } })}
              placeholder="Pattern (regex)"
              className="border rounded px-2 py-1 w-32"
            />
            <input
              type="text"
              value={field.config?.errorMessage || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, errorMessage: e.target.value } })}
              placeholder="Error Message"
              className="border rounded px-2 py-1 w-48"
            />
          </>
        )}
        {field.type === 'number' && (
          <>
            <input
              type="number"
              value={field.config?.min || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, min: e.target.value } })}
              placeholder="Min"
              className="border rounded px-2 py-1 w-20"
            />
            <input
              type="number"
              value={field.config?.max || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, max: e.target.value } })}
              placeholder="Max"
              className="border rounded px-2 py-1 w-20"
            />
            <input
              type="text"
              value={field.config?.errorMessage || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, errorMessage: e.target.value } })}
              placeholder="Error Message"
              className="border rounded px-2 py-1 w-48"
            />
          </>
        )}
        {field.type === 'date' && (
          <>
            <input
              type="date"
              value={field.config?.min || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, min: e.target.value } })}
              placeholder="Min Date"
              className="border rounded px-2 py-1 w-32"
            />
            <input
              type="date"
              value={field.config?.max || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, max: e.target.value } })}
              placeholder="Max Date"
              className="border rounded px-2 py-1 w-32"
            />
            <input
              type="text"
              value={field.config?.errorMessage || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, errorMessage: e.target.value } })}
              placeholder="Error Message"
              className="border rounded px-2 py-1 w-48"
            />
          </>
        )}
        {(field.type === 'dropdown' || field.type === 'radio') && (
          <>
            <input
              type="text"
              value={field.config?.options || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, options: e.target.value } })}
              placeholder="Options (comma separated)"
              className="border rounded px-2 py-1"
            />
            <input
              type="text"
              value={field.config?.errorMessage || ''}
              onChange={e => onUpdate(field.id, { config: { ...field.config, errorMessage: e.target.value } })}
              placeholder="Error Message"
              className="border rounded px-2 py-1 w-48"
            />
          </>
        )}
        {field.type === 'checkbox' && (
          <input
            type="text"
            value={field.config?.errorMessage || ''}
            onChange={e => onUpdate(field.id, { config: { ...field.config, errorMessage: e.target.value } })}
            placeholder="Error Message"
            className="border rounded px-2 py-1 w-48"
          />
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './fields-animations.css';
import { FIELD_TYPES } from './fieldTypes';
import './fields-animations.css';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';
import { useFormBuilderStore } from './store';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

export function FieldList({ fields, onRemove, onUpdate }) {
  // Add sensors for both pointer and touch
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 400, tolerance: 8 } })
  );
  const { reorderFields } = useFormBuilderStore();
  const [activeId, setActiveId] = React.useState(null);
  const [overId, setOverId] = React.useState(null);
  const [lastAddedId, setLastAddedId] = React.useState(null);
  const [notification, setNotification] = React.useState(null);
  const notificationTimeout = React.useRef();
  const activeField = fields.find(f => f.id === activeId);
  const activeFieldIdx = activeField ? fields.findIndex(f => f.id === activeField.id) : null;

  // Detect new field added
  const prevFieldsRef = React.useRef(fields);
  React.useEffect(() => {
    if (fields.length > prevFieldsRef.current.length) {
      // Added
      setNotification('Field added');
      if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
      notificationTimeout.current = setTimeout(() => setNotification(null), 1200);
    }
    prevFieldsRef.current = fields;
  }, [fields]);

  // Notification for remove
  const handleRemove = id => {
    onRemove(id);
    setNotification('Field removed');
    if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
    notificationTimeout.current = setTimeout(() => setNotification(null), 1200);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log('DragEnd:', { activeId: active?.id, overId: over?.id });
    if (active && over && active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      console.log('Reorder indices:', { oldIndex, newIndex });
      reorderFields(oldIndex, newIndex);
    }
    setActiveId(null);
    setOverId(null);
  }

  return (
    <div
      style={{ touchAction: activeId ? 'none' : 'auto' }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={e => setActiveId(e.active.id)}
        onDragCancel={() => { setActiveId(null); setOverId(null); }}
        onDragOver={e => setOverId(e.over?.id || null)}
      >
        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          {fields.length === 0 ? (
            <div className="text-gray-400 italic p-8 text-center border rounded bg-gray-50">
              No fields yet. Click <span className="font-semibold text-blue-500">Add Field</span> to get started!
            </div>
          ) : (
            <TransitionGroup>
              {fields.map((field, idx) => {
                const nodeRef = React.createRef();
                const highlight = field.id === lastAddedId;
                return (
                  <CSSTransition
                    key={field.id}
                    timeout={300}
                    classNames="fade-slide"
                    nodeRef={nodeRef}
                  >
                    <SortableField
                      id={field.id}
                      field={field}
                      idx={idx}
                      activeId={activeId}
                      onRemove={handleRemove}
                      onUpdate={onUpdate}
                      setActiveId={setActiveId}
                      isDropTarget={overId === field.id && activeId !== field.id}
                      nodeRef={nodeRef}
                      highlight={highlight}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          )}
        </SortableContext>
        <DragOverlay>
          {activeField ? (
            <div className="mb-2 p-2 border rounded flex flex-col gap-2 drag-overlay-animate" style={{ background: '#fffbe6' }}>
              <div className="flex items-center gap-2">
                <span className="cursor-grab text-yellow-500 mr-2 select-none">&#x2630;</span>
                <span className="font-semibold">
                  {activeField.label && activeField.label.trim() ? activeField.label : `${activeField.type.charAt(0).toUpperCase() + activeField.type.slice(1)}${activeFieldIdx !== null ? ` ${activeFieldIdx + 1}` : ''}`}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
        {notification && (
          <div className="notification">{notification}</div>
        )}
      </DndContext>
    </div>
  );
}

