// relationshipUtils.js - Functions for managing ticket relationships

// Helper function that returns a Map with ticketId -> strongest relationship type
export function filterDuplicateRelationships(relationships) {
  console.log('Filtering duplicate relationships:', relationships);
  // Store the strongest relationship per ticket ID (blocks/blockedBy > parent/child > related)
  const ticketRelationships = new Map();
  
  if (!relationships || !Array.isArray(relationships)) return ticketRelationships;
  
  // First pass - normalize all relationships to ensure they have an id property
  const normalizedRelationships = relationships.map(rel => {
    // Handle case where rel is just a string ID
    if (typeof rel === 'string') return { id: rel, type: 'related', note: '' };
    // Handle case where rel is a number ID
    if (typeof rel === 'number') return { id: String(rel), type: 'related', note: '' };
    // Handle case where rel is an object but might not have all properties
    if (rel && typeof rel === 'object') {
      return {
        id: String(rel.id || ''),
        type: rel.type || 'related',
        note: rel.note || ''
      };
    }
    return null;
  }).filter(Boolean); // Remove any null entries
  
  // Second pass - find strongest relationship for each ticket ID
  for (const rel of normalizedRelationships) {
    if (!rel.id) continue;
    
    const existingRel = ticketRelationships.get(rel.id);
    console.log(`Checking relationship for ticket ${rel.id}, type: ${rel.type}`);
    
    // If no existing relationship or current one is stronger, update the map
    // Priority: blocks/blockedBy > parent/child > related
    if (!existingRel || 
        (existingRel.type === 'related' && 
         (rel.type === 'parent' || rel.type === 'child' || rel.type === 'blocks' || rel.type === 'blockedBy')) ||
        ((existingRel.type === 'parent' || existingRel.type === 'child') && 
         (rel.type === 'blocks' || rel.type === 'blockedBy'))) {
      console.log(`Setting strongest relationship for ${rel.id} to ${rel.type}`);
      ticketRelationships.set(rel.id, rel);
    }
  }
  
  console.log('Filtered relationships:', Array.from(ticketRelationships.values()));
  return ticketRelationships;
}

// New function to clean up relationships before saving
export function cleanupRelationships(relationships) {
  console.log('Cleaning up relationships:', relationships);
  const ticketRelationships = filterDuplicateRelationships(relationships);
  const result = Array.from(ticketRelationships.values());
  console.log('Cleanup complete, returning:', result);
  return result;
}

// Helper function to check if a ticket is blocked by any other tickets
export function isTicketBlocked(ticketId, allTickets) {
  // Check if any ticket has a 'blocks' relationship with this ticket
  return allTickets.some(t => 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blocks';
    })
  );
}

// Helper function to check if a ticket is blocking any other tickets
export function isTicketBlocking(ticketId, allTickets) {
  // Check if any ticket has a 'blockedBy' relationship with this ticket
  return allTickets.some(t => 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blockedBy';
    })
  );
}

// Helper function to get all tickets that are blocking a specific ticket
export function getBlockingTickets(ticketId, allTickets) {
  // Find all tickets that have a 'blocks' relationship with this ticket
  return allTickets.filter(t => 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blocks';
    })
  );
}

// Helper function to get all tickets that are blocked by a specific ticket
export function getBlockedTickets(ticketId, allTickets) {
  // Find all tickets that have a 'blockedBy' relationship with this ticket
  return allTickets.filter(t => 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blockedBy';
    })
  );
}

// Check if a ticket is allowed to move to a specific column
export function canMoveTicket(ticketId, targetColumnId, allTickets, columns) {
  // Get all tickets blocking this one
  const blockingTickets = getBlockingTickets(ticketId, allTickets);
  
  // If no blocking tickets, movement is allowed
  if (blockingTickets.length === 0) return true;
  
  // Find column order to determine "progress"
  const columnOrder = columns.map(col => col.id);
  const targetColumnIndex = columnOrder.indexOf(targetColumnId);
  
  // For each blocking ticket, ensure it's in a column that comes after the target column
  // or is in the "done" column
  return blockingTickets.every(ticket => {
    // Get the current column of the blocking ticket
    const ticketColumn = columns.find(col => col.ticketIds.includes(ticket.id));
    if (!ticketColumn) return true; // If not found in a column, don't block movement
    
    // If the blocking ticket is in the "done" column, it doesn't block
    if (ticketColumn.id === 'done') return true;
    
    // Check if the blocking ticket's column comes after the target column in the workflow
    const blockingColumnIndex = columnOrder.indexOf(ticketColumn.id);
    return blockingColumnIndex > targetColumnIndex;
  });
}
