import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanTicket from './KanbanTicket';
import { useAppStore } from '../store';
import { DropIndicator } from './KanbanBoard';

export default function KanbanColumn({
  id,
  data,
  onRemove,
  visibleTicketIds,
  isRemoving = false,
  colUi,
  setColUi,
  onSort,
  ...rest
}) {
  // dnd-kit hook is called here, not in the parent map
  const { setNodeRef: setColDroppableRef, isOver: isColOver } = useDroppable({
    id: `${id}--column`,
    data: {
      type: 'column',
      id: id,
      colId: id, // Add colId for consistency
      isHolding: id === 'holding',
      isIncoming: data.isIncoming
    }
  });

  const colId = id;
  const isHolding = colId === 'holding';
  const isIncoming = data.isIncoming;
  // Get tickets from kanban.tickets object
  const kanbanTickets = useAppStore(s => s.kanban.tickets);
  const tickets = visibleTicketIds.map(id => kanbanTickets[id]).filter(Boolean);
  
  const handleStartRename = () => {
    setColUi(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        renaming: true,
        newColName: data.name,
      }
    }));
  };
  
  const handleRenameCol = () => {
    if (colUi[id]?.newColName) {
      const renameColumn = useAppStore.getState().updateKanbanColumnTitle;
      renameColumn(id, colUi[id].newColName);
    }
    setColUi(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        renaming: false,
      }
    }));
  };
  
  const handleSetWipLimit = () => {
    const limit = colUi[id]?.newWipLimit !== undefined ? colUi[id].newWipLimit : '';
    // Make sure it's a positive number or empty
    const wipLimit = limit.trim() === '' ? null : Math.max(1, parseInt(limit) || 1);
    
    const updateColumn = useAppStore.getState().updateKanbanColumn;
    updateColumn(id, { wipLimit });
    
    setColUi(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        editingWipLimit: false,
      }
    }));
  };
  
  const handleStartEditWipLimit = () => {
    setColUi(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        editingWipLimit: true,
        newWipLimit: data.wipLimit !== null ? String(data.wipLimit) : '',
      }
    }));
  };

  return (
    <div
      ref={setColDroppableRef}
      className={
        'flex-1 min-w-[260px] max-w-[300px] rounded-lg shadow flex flex-col transition-all h-full ' +
        (isColOver ? ' ring-4 ring-blue-400 shadow-lg' : '') +
        (isHolding ? ' bg-yellow-100 border-2 border-yellow-400' : isIncoming ? ' bg-yellow-50 border-2 border-yellow-300' : ' bg-gray-100') +
        (isRemoving ? ' fade-out' : '')
      }
    >
      {/* Fixed header */}
      <div className="sticky top-0 bg-inherit px-2 pt-2 pb-2 rounded-t z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          {/* Prevent renaming for Incoming column */}
          {colUi[colId]?.renaming && !isIncoming ? (
            <>
              <input
                className="border rounded px-2 py-1 text-lg font-bold"
                value={colUi[colId]?.newColName || ''}
                onChange={e => setColUi((u) => ({ ...u, [colId]: { ...u[colId], newColName: e.target.value } }))}
                onKeyDown={e => e.key === 'Enter' && handleRenameCol()}
                autoFocus
              />
              <button className="ml-2 text-green-700 font-bold" onClick={handleRenameCol}>✔</button>
              <button className="ml-1 text-red-600 font-bold" onClick={() => setColUi((u) => ({ ...u, [colId]: { ...u[colId], renaming: false, newColName: '' } }))}>✖</button>
            </>
          ) : (
            <>
              <h2 className={
                'font-bold text-lg flex-1 truncate ' +
                (isIncoming ? 'text-yellow-800' : 'text-gray-700')
              }>{data.name}</h2>
              {/* No controls for Incoming column */}
              {!isIncoming && (
                <div className="flex items-center gap-1 ml-2">
                  <button title="Rename" className="text-blue-600 hover:bg-blue-100 rounded p-1 text-xs" onClick={handleStartRename}>✏️</button>
                  <button title="Remove Column" className="text-red-600 hover:bg-red-100 rounded p-1 text-xs" onClick={() => onRemove(colId)}>🗑️</button>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* WIP limit display and edit - not for Incoming column */}
        {!isIncoming && (
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-700 font-semibold" style={{ fontSize: '115%' }}>
              WIP: {data.wipLimit ? 
                <span className={data.ticketIds.length > data.wipLimit ? 'text-red-600 font-bold' : ''}>
                  {data.ticketIds.length}/{data.wipLimit}
                </span> : 
                data.ticketIds.length
              }
            </span>
            <div>
              {colUi[colId]?.editingWipLimit ? (
                <>
                  <input
                    type="number"
                    min="1"
                    className="border rounded px-2 py-1 w-20 text-sm"
                    style={{ fontSize: '115%' }}
                    placeholder="Set WIP"
                    value={colUi[colId]?.newWipLimit || ''}
                    onChange={e => setColUi((u) => ({ ...u, [colId]: { ...u[colId], newWipLimit: e.target.value } }))}
                    onKeyDown={e => e.key === 'Enter' && handleSetWipLimit()}
                    autoFocus
                  />
                  <button className="text-blue-600 text-sm font-bold px-2 py-1" style={{ fontSize: '115%' }} onClick={handleSetWipLimit}>Set</button>
                </>
              ) : (
                <button 
                  onClick={handleStartEditWipLimit}
                  className="text-xs text-gray-500 hover:text-blue-600"
                  title="Set WIP limit"
                >
                  Edit WIP
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-2 pt-0 relative">
        <SortableContext 
          items={visibleTicketIds} 
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {/* DropIndicator before first ticket */}
            <DropIndicator colId={colId} index={0} />
            {tickets.length === 0 ? (
              <div className="text-gray-400 italic text-center py-4">No tickets</div>
            ) : (
              tickets.map((ticket, idx) => [
                <KanbanTicket key={ticket.id} ticket={ticket} position={idx} colId={colId} />,
                <DropIndicator key={`drop-${ticket.id}`} colId={colId} index={idx + 1} />
              ])
            )}
          </div>
        </SortableContext>
      </div>
      
      {isHolding && (
        <div className="text-yellow-700 font-bold text-center mb-2 animate-pulse">
          Tickets moved here from deleted columns. Please reassign!
        </div>
      )}
    </div>
  );
}
