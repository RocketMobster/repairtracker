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
  
  // If not an array, return empty array
  if (!Array.isArray(relationships)) return [];
  
  // Remove any undefined, null, or invalid relationships
  const validRelationships = relationships.filter(rel => {
    if (!rel) return false;
    
    if (typeof rel === 'string' || typeof rel === 'number') {
      return true; // Simple ID reference is valid
    }
    
    if (typeof rel === 'object') {
      return rel.id; // Object must have an ID
    }
    
    return false;
  });
  
  // Use the duplicate filter function to get the strongest relationship per ticket
  const ticketRelationships = filterDuplicateRelationships(validRelationships);
  const result = Array.from(ticketRelationships.values());
  
  console.log('Cleanup complete, returning:', result);
  return result;
}

// Helper function to check if a ticket is blocked by any other tickets
export function isTicketBlocked(ticketId, allTickets) {
  if (!ticketId || !allTickets || !Array.isArray(allTickets)) return false;
  
  // Check if any ticket has a 'blocks' relationship with this ticket
  return allTickets.some(t => 
    t && t.id !== ticketId && // Don't check against self
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
  if (!ticketId || !allTickets || !Array.isArray(allTickets)) return false;
  
  // Check if any ticket has a 'blockedBy' relationship with this ticket
  return allTickets.some(t => 
    t && t.id !== ticketId && // Don't check against self
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
  if (!ticketId || !allTickets || !Array.isArray(allTickets)) {
    return [];
  }
  
  // Find all tickets that have a 'blocks' relationship with this ticket
  return allTickets.filter(t => 
    t && 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      if (!rel) return false;
      const relId = typeof rel === 'object' ? rel.id : rel;
      const relType = typeof rel === 'object' ? rel.type : 'related';
      return relId === ticketId && relType === 'blocks';
    })
  );
}

// Helper function to get all tickets that are blocked by a specific ticket
export function getBlockedTickets(ticketId, allTickets) {
  if (!ticketId || !allTickets || !Array.isArray(allTickets)) {
    return [];
  }
  
  // Find all tickets that have a 'blockedBy' relationship with this ticket
  return allTickets.filter(t => 
    t && 
    Array.isArray(t.relatedTickets) && 
    t.relatedTickets.some(rel => {
      if (!rel) return false;
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

// New function to update reciprocal relationships in tickets
export function updateReciprocal(sourceTicketId, targetTicketId, relationType, allTickets) {
  const updatedTickets = [...allTickets];
  
  // Find indexes of both tickets
  const sourceIdx = updatedTickets.findIndex(t => t.id === sourceTicketId);
  const targetIdx = updatedTickets.findIndex(t => t.id === targetTicketId);
  
  if (sourceIdx < 0 || targetIdx < 0) return updatedTickets;
  
  // Ensure both tickets have relatedTickets arrays
  if (!Array.isArray(updatedTickets[sourceIdx].relatedTickets)) {
    updatedTickets[sourceIdx].relatedTickets = [];
  }
  if (!Array.isArray(updatedTickets[targetIdx].relatedTickets)) {
    updatedTickets[targetIdx].relatedTickets = [];
  }
  
  // Determine the reciprocal relationship type
  let reciprocalType = 'related';
  if (relationType === 'blocks') reciprocalType = 'blockedBy';
  else if (relationType === 'blockedBy') reciprocalType = 'blocks';
  else if (relationType === 'parent') reciprocalType = 'child';
  else if (relationType === 'child') reciprocalType = 'parent';
  
  // Update source ticket relationship if needed
  const sourceRelationshipExists = updatedTickets[sourceIdx].relatedTickets.some(rel => {
    const relId = typeof rel === 'object' ? rel.id : rel;
    return relId === targetTicketId;
  });
  
  if (sourceRelationshipExists) {
    // Update existing relationship
    updatedTickets[sourceIdx].relatedTickets = updatedTickets[sourceIdx].relatedTickets.map(rel => {
      const relId = typeof rel === 'object' ? rel.id : rel;
      if (relId === targetTicketId) {
        return typeof rel === 'object' ? { ...rel, type: relationType } : { id: rel, type: relationType };
      }
      return rel;
    });
  } else {
    // Add new relationship
    updatedTickets[sourceIdx].relatedTickets.push({ id: targetTicketId, type: relationType });
  }
  
  // Update target ticket relationship if needed
  const targetRelationshipExists = updatedTickets[targetIdx].relatedTickets.some(rel => {
    const relId = typeof rel === 'object' ? rel.id : rel;
    return relId === sourceTicketId;
  });
  
  if (targetRelationshipExists) {
    // Update existing relationship
    updatedTickets[targetIdx].relatedTickets = updatedTickets[targetIdx].relatedTickets.map(rel => {
      const relId = typeof rel === 'object' ? rel.id : rel;
      if (relId === sourceTicketId) {
        return typeof rel === 'object' ? { ...rel, type: reciprocalType } : { id: rel, type: reciprocalType };
      }
      return rel;
    });
  } else {
    // Add new relationship
    updatedTickets[targetIdx].relatedTickets.push({ id: sourceTicketId, type: reciprocalType });
  }
  
  return updatedTickets;
}

/**
 * Checks if a ticket can be closed based on the configured rules
 * @param {string} ticketId - ID of the ticket to check
 * @param {Array} allTickets - Array of all tickets to check relationships against
 * @param {Object} blockingConfig - Configuration for blocking rules
 * @returns {Object} - { canClose: boolean, reason: string, blockedByTickets: [], blockingTickets: [] }
 */
export function canCloseTicket(ticketId, allTickets, blockingConfig) {
  if (!ticketId || !allTickets || !Array.isArray(allTickets)) {
    return { canClose: true, reason: '', blockedByTickets: [], blockingTickets: [] };
  }
  
  // Default configuration if not provided
  const config = blockingConfig || {
    preventClosingBlockingTickets: true,
    preventClosingBlockedTickets: true,
  };
  
  // Find tickets that this ticket is blocking
  const blockingTickets = getBlockedTickets(ticketId, allTickets);
  
  // Find tickets that are blocking this ticket
  const blockedByTickets = getBlockingTickets(ticketId, allTickets);
  
  // Check if blocking other tickets prevents closure
  if (config.preventClosingBlockingTickets && blockingTickets.length > 0) {
    const incompleteTickets = blockingTickets.filter(t => 
      !t.status || 
      !t.status.toLowerCase().includes('complete') ||
      (Array.isArray(config.closedColumnIds) && 
       t.statusHistory && 
       t.statusHistory.length > 0 && 
       !config.closedColumnIds.includes(t.statusHistory[t.statusHistory.length - 1].columnId))
    );
    
    if (incompleteTickets.length > 0) {
      const ticketNames = incompleteTickets.map(t => 
        `${t.rmaNumber || t.rma || ''} ${t.company || 'Unknown'}`
      ).join(', ');
      
      return {
        canClose: false,
        reason: `This ticket is blocking ${incompleteTickets.length} incomplete ticket(s): ${ticketNames}. They must be completed before this can be closed.`,
        blockedByTickets,
        blockingTickets: incompleteTickets
      };
    }
  }
  
  // Check if being blocked prevents closure
  if (config.preventClosingBlockedTickets && blockedByTickets.length > 0) {
    const incompleteTickets = blockedByTickets.filter(t => 
      !t.status || 
      !t.status.toLowerCase().includes('complete') ||
      (Array.isArray(config.closedColumnIds) && 
       t.statusHistory && 
       t.statusHistory.length > 0 && 
       !config.closedColumnIds.includes(t.statusHistory[t.statusHistory.length - 1].columnId))
    );
    
    if (incompleteTickets.length > 0) {
      const ticketNames = incompleteTickets.map(t => 
        `${t.rmaNumber || t.rma || ''} ${t.company || 'Unknown'}`
      ).join(', ');
      
      return {
        canClose: false,
        reason: `This ticket is blocked by ${incompleteTickets.length} incomplete ticket(s): ${ticketNames}. They must be completed before this can be closed.`,
        blockedByTickets: incompleteTickets,
        blockingTickets
      };
    }
  }
  
  // If we made it here, ticket can be closed
  return { 
    canClose: true, 
    reason: '', 
    blockedByTickets, 
    blockingTickets 
  };
}

/**
 * Checks if a ticket can be shipped based on the configured rules
 * @param {string} ticketId - ID of the ticket to check
 * @param {Array} allTickets - Array of all tickets to check relationships against
 * @param {Object} blockingConfig - Configuration for blocking rules
 * @returns {Object} - { canShip: boolean, reason: string, blockedByTickets: [], blockingTickets: [] }
 */
export function canShipTicket(ticketId, allTickets, blockingConfig) {
  if (!ticketId || !allTickets || !Array.isArray(allTickets)) {
    return { canShip: true, reason: '', blockedByTickets: [], blockingTickets: [] };
  }
  
  // Default configuration if not provided
  const config = blockingConfig || {
    preventShippingBlockingTickets: true,
    preventShippingBlockedTickets: true,
  };
  
  // Find tickets that this ticket is blocking
  const blockingTickets = getBlockedTickets(ticketId, allTickets);
  
  // Find tickets that are blocking this ticket
  const blockedByTickets = getBlockingTickets(ticketId, allTickets);
  
  // Check if blocking other tickets prevents shipping
  if (config.preventShippingBlockingTickets && blockingTickets.length > 0) {
    const incompleteTickets = blockingTickets.filter(t => 
      !t.status || 
      !t.status.toLowerCase().includes('complete') ||
      (Array.isArray(config.closedColumnIds) && 
       t.statusHistory && 
       t.statusHistory.length > 0 && 
       !config.closedColumnIds.includes(t.statusHistory[t.statusHistory.length - 1].columnId))
    );
    
    if (incompleteTickets.length > 0) {
      const ticketNames = incompleteTickets.map(t => 
        `${t.rmaNumber || t.rma || ''} ${t.company || 'Unknown'}`
      ).join(', ');
      
      return {
        canShip: false,
        reason: `This ticket is blocking ${incompleteTickets.length} incomplete ticket(s): ${ticketNames}. They must be completed before this can be shipped.`,
        blockedByTickets,
        blockingTickets: incompleteTickets
      };
    }
  }
  
  // Check if being blocked prevents shipping
  if (config.preventShippingBlockedTickets && blockedByTickets.length > 0) {
    const incompleteTickets = blockedByTickets.filter(t => 
      !t.status || 
      !t.status.toLowerCase().includes('complete') ||
      (Array.isArray(config.closedColumnIds) && 
       t.statusHistory && 
       t.statusHistory.length > 0 && 
       !config.closedColumnIds.includes(t.statusHistory[t.statusHistory.length - 1].columnId))
    );
    
    if (incompleteTickets.length > 0) {
      const ticketNames = incompleteTickets.map(t => 
        `${t.rmaNumber || t.rma || ''} ${t.company || 'Unknown'}`
      ).join(', ');
      
      return {
        canShip: false,
        reason: `This ticket is blocked by ${incompleteTickets.length} incomplete ticket(s): ${ticketNames}. They must be completed before this can be shipped.`,
        blockedByTickets: incompleteTickets,
        blockingTickets
      };
    }
  }
  
  // If we made it here, ticket can be shipped
  return { 
    canShip: true, 
    reason: '', 
    blockedByTickets, 
    blockingTickets 
  };
}
