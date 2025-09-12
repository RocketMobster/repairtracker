// Updated moveTicket function with proper upward drag handling
// Replace the existing moveTicket function with this one
      moveTicket: (ticketId, toColId, toIdx = -1) => set((state) => {
        console.log(`MoveTicket called for ${ticketId} to column ${toColId} at position ${toIdx}`);
        
        // Get columns involved in the move
        const fromCol = state.kanban.columns.find(col => col.ticketIds.includes(ticketId));
        const toCol = state.kanban.columns.find(col => col.id === toColId);
        
        // Validate columns
        if (!fromCol) {
          console.error(`Ticket ${ticketId} not found in any column`);
          return state;
        }
        if (!toCol) {
          console.error(`Target column ${toColId} not found`);
          return state;
        }

        // Record the source information for logging
        const fromIdx = fromCol.ticketIds.indexOf(ticketId);
        const isSameColumn = fromCol.id === toCol.id;
        
        console.log(`Source info: column=${fromCol.id}, index=${fromIdx}`);
        console.log(`Target info: column=${toCol.id}, index=${toIdx}`);
        console.log(`Same column? ${isSameColumn}`);
        
        // If moving within the same column, determine direction
        if (isSameColumn) {
          if (fromIdx < toIdx) {
            console.log("DOWNWARD move within same column");
          } else if (fromIdx > toIdx) {
            console.log("UPWARD move within same column");
          } else {
            console.log("No movement (same position)");
            return state; // No change needed
          }
        }
        
        // Deep copy the columns to avoid state mutation
        const columnsCopy = JSON.parse(JSON.stringify(state.kanban.columns));
        
        // Find the source and target columns in our copy
        const sourceCol = columnsCopy.find(col => col.id === fromCol.id);
        const targetCol = columnsCopy.find(col => col.id === toCol.id);
        
        // Get normalized target index
        let normalizedToIdx = toIdx;
        if (normalizedToIdx < 0 || normalizedToIdx > targetCol.ticketIds.length) {
          normalizedToIdx = targetCol.ticketIds.length;
        }
        
        // Handle same column movement
        if (isSameColumn) {
          // Remove the ticket from its current position
          sourceCol.ticketIds.splice(fromIdx, 1);
          
          // Adjust insertion index for downward moves
          if (fromIdx < normalizedToIdx) {
            // When moving down, the target position shifts because we removed the item
            normalizedToIdx = Math.max(0, normalizedToIdx - 1);
          }
          
          // Insert at the target position
          sourceCol.ticketIds.splice(normalizedToIdx, 0, ticketId);
          
          console.log(`Reordered in same column. New order: ${sourceCol.ticketIds.join(', ')}`);
        } else {
          // Remove from source column
          sourceCol.ticketIds = sourceCol.ticketIds.filter(id => id !== ticketId);
          
          // Add to target column at specified index
          targetCol.ticketIds.splice(normalizedToIdx, 0, ticketId);
          
          console.log(`Moved to different column. Source now: ${sourceCol.ticketIds.join(', ')}`);
          console.log(`Target now: ${targetCol.ticketIds.join(', ')}`);
        }
        
        // Update ticket statusHistory if moving to a different column
        const ticketToUpdate = { ...state.kanban.tickets[ticketId] };
        const now = new Date().toISOString();
        
        // Only update statusHistory if moving to a different column
        if (!isSameColumn && ticketToUpdate) {
          console.log(`Updating status history for ticket ${ticketId}`);
          // Create a new statusHistory entry with consistent property names
          ticketToUpdate.statusHistory = [
            ...(ticketToUpdate.statusHistory || []),
            { columnId: toCol.id, timestamp: now }
          ];
        }
        
        // Check if we need to remove an empty Incoming column
        let columns = columnsCopy;
        let columnOrder = [...state.kanban.columnOrder];
        const incoming = columns.find(col => col.id === 'incoming');
        if (incoming && incoming.ticketIds.length === 0 && fromCol.id === 'incoming') {
          console.log('Removing empty Incoming column');
          columns = columns.filter(col => col.id !== 'incoming');
          columnOrder = columnOrder.filter(id => id !== 'incoming');
        }
        
        // Create a new tickets object with the updated ticket
        const updatedTickets = {
          ...state.kanban.tickets,
          [ticketId]: ticketToUpdate
        };
        
        console.log('Move complete, returning updated state');
        
        return { 
          kanban: { 
            ...state.kanban, 
            columns, 
            columnOrder, 
            tickets: updatedTickets 
          } 
        };
      }),