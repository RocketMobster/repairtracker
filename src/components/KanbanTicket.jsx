import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '../store';

export default function KanbanTicket({ ticket, colId, position }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: { colId }
  });
  const updateKanbanTicket = useAppStore((s) => s.updateKanbanTicket);
  const removeKanbanTicket = useAppStore((s) => s.removeKanbanTicket);
  const navigate = useNavigate();

  // Quick action handlers
  const handleEdit = (e) => {
    e.stopPropagation();
    // Navigate to edit page or open modal (stub)
    navigate(`/tickets/${ticket.id}/edit`);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this ticket?')) {
      removeKanbanTicket(ticket.id);
    }
  };
  const handleView = (e) => {
    e.stopPropagation();
    navigate(`/tickets/${ticket.id}`);
  };
  const togglePriority = (e) => {
    e.stopPropagation();
    updateKanbanTicket({ ...ticket, highPriority: !ticket.highPriority });
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: isDragging
          ? transition || 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms, opacity 200ms'
          : 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms, opacity 200ms',
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 'auto',
      }}
      className={`relative bg-white rounded shadow p-3 border cursor-move transition-colors ${ticket.highPriority ? 'border-red-500 ring-2 ring-red-400 bg-red-50' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-400">#{position + 1}</span>
        <div className="flex gap-1">
          <button onClick={handleView} title="View Details" className="text-blue-600 hover:bg-blue-100 rounded p-1 text-xs">🔍</button>
          <button onClick={handleEdit} title="Edit Ticket" className="text-yellow-600 hover:bg-yellow-100 rounded p-1 text-xs">✏️</button>
          <button onClick={handleDelete} title="Delete Ticket" className="text-red-600 hover:bg-red-100 rounded p-1 text-xs">🗑️</button>
          <button
            onClick={togglePriority}
            title={ticket.highPriority ? 'Unset High Priority' : 'Mark High Priority'}
            className={`ml-2 text-xs px-2 py-1 rounded font-bold ${ticket.highPriority ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-100'}`}
          >
            {ticket.highPriority ? 'HIGH' : 'Set High'}
          </button>
        </div>
      </div>
      <div className="font-semibold">{ticket.title}</div>
      <div className="text-xs text-gray-500">ID: {ticket.id}</div>
      {ticket.rma && <div className="text-xs text-gray-400">RMA: {ticket.rma}</div>}
      {ticket.company && <div className="text-xs text-gray-400">Company: {ticket.company}</div>}
    </div>
  );
}
