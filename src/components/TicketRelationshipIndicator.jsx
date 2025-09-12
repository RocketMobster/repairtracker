import React, { memo } from 'react';
import { useAppStore } from '../store';

/**
 * Component that displays visual indicators for tickets that are blocking or blocked by other tickets
 */
const TicketRelationshipIndicator = memo(function TicketRelationshipIndicator({ ticketId }) {
  // Get tickets once and memoize the component to prevent re-renders
  const tickets = useAppStore(state => state.kanban.tickets);
  
  // Get all tickets as an array
  const allTickets = Object.values(tickets);
  
  // Find blocking tickets (tickets that have a 'blocks' relationship with this ticket)
  const blockingTickets = allTickets.filter(t => 
    t && 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      if (!rel) return false;
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blocks';
    })
  );
  
  // Find blocked by tickets (tickets that have a 'blockedBy' relationship with this ticket)
  const blockedByTickets = allTickets.filter(t => 
    t && 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      if (!rel) return false;
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blockedBy';
    })
  );
  
  // If no relationships, don't render anything
  if (blockingTickets.length === 0 && blockedByTickets.length === 0) {
    return null;
  }
  
  return (
    <div className="flex space-x-1 mt-1">
      {blockingTickets.length > 0 && (
        <div 
          className="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-800 flex items-center"
          title={`This ticket is blocking ${blockingTickets.length} other ticket(s)`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {blockingTickets.length}
        </div>
      )}
      
      {blockedByTickets.length > 0 && (
        <div 
          className="px-1.5 py-0.5 text-xs rounded bg-amber-100 text-amber-800 flex items-center"
          title={`This ticket is blocked by ${blockedByTickets.length} other ticket(s)`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {blockedByTickets.length}
        </div>
      )}
    </div>
  );
});

export default TicketRelationshipIndicator;
