import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid';
import { 
  cleanupRelationships, 
  canMoveTicket, 
  canCloseTicket, 
  canShipTicket 
} from './utils/relationshipUtils';
import { toast } from 'react-toastify';

// Create a stable reference for the store to avoid snapshot creation issues
const createStoreWithStableReferences = () => {
  // Define the store with all state
  return create(
    persist(
      (set, get) => ({
        currentUser: null, // { id, username, role }
        tickets: [],
        customers: [],
        users: [],
        statuses: [],
        plugins: [],
        rolePermissions: {},
        // Add more state as needed
        // Placeholder for future barcode plugin
        barcode: null,
        // Blocking system - track notifications
        lastBlockingNotifications: {},
        
        // Relationship blocking configuration
        blockingConfig: {
          // If true, prevent tickets from being closed if they are blocking other tickets
          preventClosingBlockingTickets: true,
          // If true, prevent tickets from being closed if they are blocked by other tickets
          preventClosingBlockedTickets: true,
          // If true, prevent tickets from being shipped if they are blocking other tickets
          preventShippingBlockingTickets: true,
          // If true, prevent tickets from being shipped if they are blocked by other tickets
          preventShippingBlockedTickets: true,
          // Column IDs that are considered "closed" or "done"
          closedColumnIds: ['done'],
          // Column IDs that are considered "shipping" or "ready to ship"
          shippingColumnIds: ['shipping'],
        },
      
      // Function to update blocking configuration
      updateBlockingConfig: (newConfig) => set((state) => ({
        blockingConfig: { ...state.blockingConfig, ...newConfig }
      })),
      
      // Clean up existing relationships in all tickets
      deduplicateAllRelationships: () => set((state) => {
        const kanban = { ...state.kanban };
        
        // Process each ticket's relationships
        if (kanban.tickets) {
          Object.keys(kanban.tickets).forEach(ticketId => {
            if (kanban.tickets[ticketId] && Array.isArray(kanban.tickets[ticketId].relatedTickets)) {
              // Apply deduplication
              kanban.tickets[ticketId].relatedTickets = cleanupRelationships(kanban.tickets[ticketId].relatedTickets);
            }
          });
        }
        
        return { kanban };
      }),
      
      setCurrentUser: (user) => set({ currentUser: user }),
      setTickets: (tickets) => set({ tickets }),
      setCustomers: (customers) => set({ customers }),
      setUsers: (users) => set({ users }),
      setStatuses: (statuses) => set({ statuses }),
      setPlugins: (plugins) => set({ plugins }),
      setRolePermissions: (rolePermissions) => set({ rolePermissions }),

      // --- Kanban Board State ---
      kanban: {
        columns: [
          { id: 'backlog', name: 'Backlog', wipLimit: null, maxTime: null, ticketIds: [], defaultForNewTickets: false },
          { id: 'inProgress', name: 'In Progress', wipLimit: null, maxTime: null, ticketIds: [], defaultForNewTickets: false },
          { id: 'review', name: 'Review', wipLimit: null, maxTime: null, ticketIds: [], defaultForNewTickets: false },
          { id: 'done', name: 'Done', wipLimit: null, maxTime: null, ticketIds: [], defaultForNewTickets: false }
        ],
        columnOrder: ['backlog', 'inProgress', 'review', 'done'],
        tickets: {},
      },
      // Set a column as the default for new tickets (admin only)
      setDefaultKanbanColumn: (colId) => set(state => {
        const columns = state.kanban.columns.map(col => ({ ...col, defaultForNewTickets: col.id === colId }));
        return { kanban: { ...state.kanban, columns } };
      }),

      // Add or remove the Uncategorized column as needed
      ensureUncategorizedColumn: () => set(state => {
        let columns = [...state.kanban.columns];
        let columnOrder = [...state.kanban.columnOrder];
        let uncategorized = columns.find(col => col.id === 'uncategorized');
        // Add if missing
        if (!uncategorized) {
          columns.push({ id: 'incoming', name: 'Incoming', wipLimit: null, maxTime: null, ticketIds: [], defaultForNewTickets: false, isIncoming: true });
          columnOrder.unshift('incoming');
        }
        // Remove if empty
        const incoming = columns.find(col => col.id === 'incoming');
        if (incoming && incoming.ticketIds.length === 0) {
          columns = columns.filter(col => col.id !== 'incoming');
          columnOrder = columnOrder.filter(id => id !== 'incoming');
        }
        return { kanban: { ...state.kanban, columns, columnOrder } };
      }),

      // Assign tickets to persistent columns by statusHistory
      assignTicketsToKanbanColumns: () => set((state) => {
        const tickets = state.tickets || [];
        // Clone columns and clear ticketIds
        const columns = state.kanban.columns.map(col => ({ ...col, ticketIds: [] }));
        const kanbanTickets = {};
        tickets.forEach(ticket => {
          const latestCol = (ticket.statusHistory && ticket.statusHistory.length > 0)
            ? ticket.statusHistory[ticket.statusHistory.length - 1].columnId
            : 'backlog';
          const col = columns.find(c => c.id === latestCol) || columns[0];
          col.ticketIds.push(ticket.id);
          kanbanTickets[ticket.id] = ticket;
        });
        return {
          kanban: {
            ...state.kanban,
            columns,
            tickets: kanbanTickets,
          }
        };
      }),

      // Kanban Actions
      updateKanbanColumnTitle: (colId, newTitle) => set((state) => {
        const kanban = { ...state.kanban };
        if (kanban.columns[colId]) {
          kanban.columns[colId] = { ...kanban.columns[colId], title: newTitle };
        }
        return { kanban };
      }),
      // Add the updateKanbanColumn function to handle WIP limits and other column properties
      updateKanbanColumn: (colId, updatedProps) => set((state) => {
        // Find the column by ID
        const columnToUpdate = state.kanban.columns.find(col => col.id === colId);
        
        if (!columnToUpdate) {
          console.warn(`Column with id ${colId} not found`);
          return state;
        }
        
        console.log(`Updating column ${colId} with properties:`, updatedProps);
        
        // Create new columns array with the updated column
        const updatedColumns = state.kanban.columns.map(col => {
          if (col.id === colId) {
            return { ...col, ...updatedProps };
          }
          return col;
        });
        
        return {
          kanban: {
            ...state.kanban,
            columns: updatedColumns
          }
        };
      }),
      setKanban: (kanban) => set({ kanban }),
      moveTicket: (ticketId, toColId, toIdx) => set(state => {
        console.log(`moveTicket called with: ticketId=${ticketId}, toColId=${toColId}, toIdx=${toIdx}`);
        
        // Find the columns
        const fromCol = state.kanban.columns.find(col => col.ticketIds.includes(ticketId));
        const toCol = state.kanban.columns.find(col => col.id === toColId);
        
        // Debug output
        console.log('From column:', fromCol ? fromCol.id : 'not found');
        console.log('To column:', toCol ? toCol.id : 'not found');
        
        if (!fromCol || !toCol) {
          console.warn('Source or target column not found');
          return {}; // No change
        }
        
        // If the target column is the same as the source column, just reorder within column
        if (fromCol.id === toCol.id) {
          const fromIdx = fromCol.ticketIds.indexOf(ticketId);
          
          // Ensure toIdx is valid
          const safeToIdx = Math.max(0, Math.min(toIdx, fromCol.ticketIds.length - 1));
          
          if (fromIdx === safeToIdx) {
            console.log('Same position, no change needed');
            return {}; // No change needed
          }
          
          console.log(`Reordering within column ${fromCol.id} from ${fromIdx} to ${safeToIdx}`);
          
          // Create new columns array with updated ticketIds
          const newColumns = state.kanban.columns.map(col => {
            if (col.id === fromCol.id) {
              // Create a new array of ticketIds with the item moved
              const newTicketIds = [...col.ticketIds];
              
              // Handle special case: When moving a ticket up (to a lower index)
              // we need to adjust the target index
              if (safeToIdx < fromIdx) {
                console.log(`Moving upward from ${fromIdx} to ${safeToIdx}`);
                
                // Special handling for moving to the top position
                if (safeToIdx === 0) {
                  console.log("Moving to the TOP position - special handling");
                  newTicketIds.splice(fromIdx, 1); // Remove from original position
                  newTicketIds.unshift(ticketId); // Add to the beginning
                } else {
                  newTicketIds.splice(fromIdx, 1); // Remove from original position
                  newTicketIds.splice(safeToIdx, 0, ticketId); // Insert at new position
                }
              } else {
                // Normal case - moving down
                const [movedItem] = newTicketIds.splice(fromIdx, 1);
                newTicketIds.splice(safeToIdx, 0, movedItem);
              }
              
              return { ...col, ticketIds: newTicketIds };
            }
            return col;
          });
          
          return {
            kanban: {
              ...state.kanban,
              columns: newColumns
            }
          };
        }
        
        // If moving between columns
        // If moving backward in the workflow, always allow
        const fromColIndex = state.kanban.columnOrder.indexOf(fromCol.id);
        const toColIndex = state.kanban.columnOrder.indexOf(toCol.id);
        const isMovingBackward = toColIndex < fromColIndex;
        
        console.log(`Moving between columns: ${fromCol.id} -> ${toCol.id} (${isMovingBackward ? 'backward' : 'forward'})`);
        
        // Get the current ticket
        const currentTicket = state.kanban.tickets[ticketId];
        if (!currentTicket) {
          console.warn('Ticket not found in kanban tickets');
          return {};
        }
        
        // Get all tickets for relationship checking
        const allTickets = Object.values(state.kanban.tickets);
        
        // Add all tickets from the main store that aren't on the board for complete relationship checking
        const allTicketsInSystem = Array.isArray(state.tickets) ? state.tickets : [];
        const combinedTickets = [...allTickets];
        allTicketsInSystem.forEach(systemTicket => {
          if (!combinedTickets.some(boardTicket => boardTicket.id === systemTicket.id)) {
            combinedTickets.push(systemTicket);
          }
        });
        
        // If we're moving to a closed column, check if the ticket can be closed
        if (state.blockingConfig.closedColumnIds && state.blockingConfig.closedColumnIds.includes(toColId) && 
            state.blockingConfig.preventClosingBlockingTickets) {
          const { canClose, reason, blockingTickets, blockedByTickets } = canCloseTicket(
            ticketId, 
            combinedTickets, 
            state.blockingConfig
          );
          
          if (!canClose) {
            // Show notification about why the ticket can't be closed
            toast.warning(reason, {
              position: "bottom-right",
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
            });
            
            // Store the notification in state for potential future use
            state.lastBlockingNotifications[ticketId] = {
              timestamp: Date.now(),
              message: reason,
              blockingTickets,
              blockedByTickets
            };
            
            // Block the move if configured to enforce this rule
            console.warn('Move blocked: ticket cannot be closed');
            return {}; // Block move
          }
        }
        
        // If we're moving to a shipping column, check if the ticket can be shipped
        if (state.blockingConfig.shippingColumnIds && state.blockingConfig.shippingColumnIds.includes(toColId) && 
            (state.blockingConfig.preventShippingBlockingTickets || state.blockingConfig.preventShippingBlockedTickets)) {
          const { canShip, reason, blockingTickets, blockedByTickets } = canShipTicket(
            ticketId, 
            combinedTickets, 
            state.blockingConfig
          );
          
          if (!canShip) {
            // Show notification about why the ticket can't be shipped
            toast.warning(reason, {
              position: "bottom-right",
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
            });
            
            // Store the notification in state for potential future use
            state.lastBlockingNotifications[ticketId] = {
              timestamp: Date.now(),
              message: reason,
              blockingTickets,
              blockedByTickets
            };
            
            // Block the move if configured to enforce this rule
            console.warn('Move blocked: ticket cannot be shipped');
            return {}; // Block move
          }
        }
        
        // Check for blocking tickets if moving forward in the workflow
        if (!isMovingBackward && 
            (!state.blockingConfig.closedColumnIds || !state.blockingConfig.closedColumnIds.includes(toColId)) && 
            (!state.blockingConfig.shippingColumnIds || !state.blockingConfig.shippingColumnIds.includes(toColId))) {
          // Check if ticket is blocked by other tickets that aren't done
          if (typeof canMoveTicket === 'function') {
            const canMove = canMoveTicket(ticketId, toColId, combinedTickets, state.kanban.columns);
            
            if (!canMove) {
              // If can't move, show notification but don't block for now
              toast.warning("This ticket depends on other tickets that aren't complete yet.", {
                position: "bottom-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
              });
              
              // Store the notification in state for potential future use
              state.lastBlockingNotifications[ticketId] = {
                timestamp: Date.now(),
                message: "This ticket depends on other tickets that aren't complete yet."
              };
              
              // Uncomment to enforce strict blocking
              // console.warn('Move blocked: ticket is blocked by others');
              // return {}; // Block move
            }
          }
        }
        
        // Enforce WIP limit - but only if it's not the same column (we already handled same-column case above)
        if (fromCol.id !== toCol.id && toCol.wipLimit && toCol.ticketIds.length >= toCol.wipLimit) {
          toast.warning(`Column "${toCol.name}" has reached its WIP limit of ${toCol.wipLimit}`, {
            position: "bottom-right",
            autoClose: 3000,
          });
          console.warn('Move blocked: WIP limit reached');
          return {}; // Block move
        }
        
        console.log('All checks passed, performing move');
        
        // Create new columns array with updated ticketIds
        const newColumns = state.kanban.columns.map(col => {
          if (col.id === fromCol.id) {
            // If moving within the same column, we'll handle removal in the next block
            if (fromCol.id !== toCol.id) {
              // Remove from source column only if moving to a different column
              return { 
                ...col, 
                ticketIds: col.ticketIds.filter(id => id !== ticketId) 
              };
            }
            return col; // Will be handled below if same column
          }
          if (col.id === toCol.id) {
            // Add to target column
            const newTicketIds = [...col.ticketIds];
            
            // If same column, handle the position change correctly
            if (fromCol.id === toCol.id) {
              const fromIdx = newTicketIds.indexOf(ticketId);
              console.log(`Moving in same column from index ${fromIdx} to ${toIdx}`);
              
              if (fromIdx !== -1) {
                // Remove ticket from current position
                newTicketIds.splice(fromIdx, 1);
                
                // Calculate proper insertion index
                // If moving to a position after the current one, we need to account for the removal
                let insertIndex = toIdx;
                if (fromIdx < toIdx) {
                  // When moving down, the target position is shifted by 1 due to removal
                  insertIndex = Math.max(0, toIdx - 1);
                  console.log(`Adjusted index for downward move: ${insertIndex}`);
                } else {
                  console.log(`No adjustment needed for upward move, using index: ${insertIndex}`);
                }
                
                // Make sure insertIndex is within bounds
                insertIndex = Math.min(insertIndex, newTicketIds.length);
                
                // Insert at the properly adjusted index
                newTicketIds.splice(insertIndex, 0, ticketId);
                console.log(`Final ticketIds after move: ${newTicketIds.join(', ')}`);
              }
            } else {
              // Make sure toIdx is within bounds for cross-column movement
              // Special handling for dropping to the top position
              if (toIdx === 0) {
                console.log("Cross-column move to TOP position - special handling");
                newTicketIds.unshift(ticketId); // Add to the beginning
              } else {
                const safeIdx = Math.min(toIdx, newTicketIds.length);
                // Insert at the target index
                newTicketIds.splice(safeIdx, 0, ticketId);
              }
              console.log(`Moved to different column at position: ${toIdx}`);
            }
            return { ...col, ticketIds: newTicketIds };
          }
          return col;
        });
        
        // Update ticket statusHistory if moving to a different column
        const ticketToUpdate = { ...state.kanban.tickets[ticketId] };
        const now = new Date().toISOString();
        
        // Only update statusHistory if moving to a different column
        if (fromCol.id !== toCol.id && ticketToUpdate) {
          console.log(`Updating status history for ticket ${ticketId}`);
          // Create a new statusHistory entry with consistent property names
          ticketToUpdate.statusHistory = [
            ...(ticketToUpdate.statusHistory || []),
            { columnId: toCol.id, timestamp: now }
          ];
        }
        
        // Remove Incoming column if empty after move
        let columns = [...newColumns]; // Use the newColumns we just created
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
      reorderTicket: (colId, startIndex, endIndex) => set((state) => {
        const kanban = { ...state.kanban };
        const ticketIds = Array.from(kanban.columns[colId].ticketIds);
        const [removed] = ticketIds.splice(startIndex, 1);
        ticketIds.splice(endIndex, 0, removed);
        kanban.columns[colId].ticketIds = ticketIds;
        return { kanban };
      }),
      /**
       * Syncs group colors between all related tickets on the board.
       * This ensures that tickets in the same relationship group share the same group colors.
       * @private
       */
      _syncGroupColorsForAllTickets: (state) => {
        const kanban = { ...state.kanban };
        const allBoardTickets = Object.values(kanban.tickets || {});
        const allTickets = Array.isArray(state.tickets) ? state.tickets : [];
        
        // First, collect all unique groups and their colors
        const groupColorMap = new Map(); // Map of groupId -> color
        
        // Collect from board tickets
        allBoardTickets.forEach(ticket => {
          if (Array.isArray(ticket.groupColors)) {
            ticket.groupColors.forEach(group => {
              if (group && typeof group === 'object' && group.id && group.color) {
                groupColorMap.set(group.id, group.color);
              }
            });
          }
        });
        
        // Collect from all tickets
        allTickets.forEach(ticket => {
          if (Array.isArray(ticket.groupColors)) {
            ticket.groupColors.forEach(group => {
              if (group && typeof group === 'object' && group.id && group.color) {
                groupColorMap.set(group.id, group.color);
              }
            });
          }
        });
        
        // Now, find all relationships between tickets
        const relationshipGroups = new Map(); // Map of ticketId -> Set of related ticketIds
        
        // Build relationship graph
        allBoardTickets.forEach(ticket => {
          if (!ticket.id) return;
          
          // Initialize set for this ticket if not exists
          if (!relationshipGroups.has(ticket.id)) {
            relationshipGroups.set(ticket.id, new Set());
          }
          
          // Add all related tickets
          if (Array.isArray(ticket.relatedTickets)) {
            ticket.relatedTickets.forEach(rel => {
              const relId = typeof rel === 'object' ? rel.id : rel;
              if (relId) {
                relationshipGroups.get(ticket.id).add(relId);
                
                // Also add the reverse relationship
                if (!relationshipGroups.has(relId)) {
                  relationshipGroups.set(relId, new Set());
                }
                relationshipGroups.get(relId).add(ticket.id);
              }
            });
          }
        });
        
        // For each relationship group, ensure all tickets have the same group colors
        relationshipGroups.forEach((relatedIds, ticketId) => {
          // Skip if no relationships
          if (relatedIds.size === 0) return;
          
          // Create a stable group ID based on sorted ticket IDs
          const allIds = [ticketId, ...Array.from(relatedIds)].sort();
          const groupId = `group-${allIds.join('-')}`;
          
          // If this group doesn't have a color yet, assign one
          if (!groupColorMap.has(groupId)) {
            // Use existing color from any ticket in the group if available
            let foundColor = null;
            
            // Check board tickets first
            for (const id of allIds) {
              const ticket = kanban.tickets[id];
              if (ticket && ticket.groupColor) {
                foundColor = ticket.groupColor;
                break;
              }
            }
            
            // If no color found, use a default
            if (!foundColor) {
              foundColor = '#6B7280'; // Default gray
            }
            
            groupColorMap.set(groupId, foundColor);
          }
          
          const color = groupColorMap.get(groupId);
          
          // Update all tickets in this group with the group color
          for (const id of allIds) {
            // Update board tickets
            if (kanban.tickets[id]) {
              // Initialize or clean up groupColors array
              if (!Array.isArray(kanban.tickets[id].groupColors)) {
                kanban.tickets[id].groupColors = [];
              }
              
              // Add this group if not present
              const existingIdx = kanban.tickets[id].groupColors.findIndex(g => g && g.id === groupId);
              if (existingIdx >= 0) {
                kanban.tickets[id].groupColors[existingIdx].color = color;
              } else {
                kanban.tickets[id].groupColors.push({ id: groupId, color });
              }
              
              // Also update the legacy groupColor property
              kanban.tickets[id].groupColor = color;
            }
          }
        });
        
        // Also sync with main tickets array
        let ticketsArr = [...allTickets];
        ticketsArr = ticketsArr.map(ticket => {
          const id = ticket.id;
          if (!id) return ticket;
          
          // Find all groups this ticket belongs to
          const groups = [];
          relationshipGroups.forEach((relatedIds, ticketId) => {
            if (ticketId === id || relatedIds.has(id)) {
              const allIds = [ticketId, ...Array.from(relatedIds)].sort();
              const groupId = `group-${allIds.join('-')}`;
              if (groupColorMap.has(groupId)) {
                groups.push({ id: groupId, color: groupColorMap.get(groupId) });
              }
            }
          });
          
          // If no groups found, leave ticket unchanged
          if (groups.length === 0) return ticket;
          
          // Update ticket with group colors
          return {
            ...ticket,
            groupColors: groups,
            groupColor: groups[0]?.color || ticket.groupColor // Keep legacy property
          };
        });
        
        return { kanban, tickets: ticketsArr };
      },

      addKanbanTicket: (ticket) => set((state) => {
        const kanban = { ...state.kanban };
        // Ensure ticket has an activity/comments array and a customFields object
        const ticketWithActivity = {
          ...ticket,
          activity: Array.isArray(ticket.activity) ? ticket.activity : [],
          customFields: typeof ticket.customFields === 'object' && ticket.customFields !== null ? ticket.customFields : {},
          relatedTickets: cleanupRelationships(Array.isArray(ticket.relatedTickets) ? ticket.relatedTickets : []),
          externalLinks: Array.isArray(ticket.externalLinks) ? ticket.externalLinks : [],
          groupColor: ticket.groupColor || null, // Preserve existing group color
          // Ensure groupColors array is properly initialized
          groupColors: Array.isArray(ticket.groupColors) ? ticket.groupColors : 
            (ticket.groupColor ? [{ id: `group-${ticket.id}`, color: ticket.groupColor }] : [])
        };
        kanban.tickets[ticket.id] = ticketWithActivity;
        
        // Also add to main tickets array if not present
        let ticketsArr = Array.isArray(state.tickets) ? [...state.tickets] : [];
        if (!ticketsArr.find(t => t.id === ticket.id)) {
          ticketsArr.push(ticketWithActivity);
        }
        
        // Find default column
        let defaultCol = kanban.columns.find(col => col.defaultForNewTickets);
        if (!defaultCol) {
          // Use Uncategorized if no default set
          defaultCol = kanban.columns.find(col => col.id === 'incoming');
          if (!defaultCol) {
            defaultCol = { id: 'incoming', name: 'Incoming', wipLimit: null, maxTime: null, ticketIds: [], defaultForNewTickets: false, isIncoming: true };
            kanban.columns.push(defaultCol);
            kanban.columnOrder.unshift('incoming');
          }
        }
        defaultCol.ticketIds.push(ticket.id);
        
        // After adding the ticket, sync all group colors
        const updatedState = { kanban, tickets: ticketsArr };
        return state._syncGroupColorsForAllTickets(updatedState);
      }),
      /**
       * Assigns a group color to all tickets in a relationship group.
       * @param {string[]} ticketIds - Array of ticket IDs in the group
       * @param {string} color - The color to assign
       * @param {string} groupId - Optional group identifier (defaults to a hash of the sorted ticket IDs)
       */
      setGroupColorForTickets: (ticketIds, color, groupId = null) => set((state) => {
        // If no groupId provided, create a stable ID based on the ticket IDs
        // This ensures the same set of tickets always gets the same group ID
        if (!groupId) {
          // Sort ticket IDs to ensure stable groupId regardless of order
          const sortedIds = [...ticketIds].sort();
          groupId = `group-${sortedIds.join('-')}`;
        }
        
        const kanban = { ...state.kanban };
        
        // Update tickets in kanban board
        ticketIds.forEach(id => {
          if (kanban.tickets[id]) {
            // Initialize groupColors array if needed
            if (!kanban.tickets[id].groupColors) {
              kanban.tickets[id].groupColors = [];
            } else {
              // Clean up any duplicate groups that might exist
              kanban.tickets[id].groupColors = kanban.tickets[id].groupColors.filter(g => 
                g && typeof g === 'object' && g.id && g.color
              );
            }
            
            // Add the new group color if it doesn't exist already
            const existingGroupIndex = kanban.tickets[id].groupColors.findIndex(g => g.id === groupId);
            if (existingGroupIndex >= 0) {
              // Update existing group color
              kanban.tickets[id].groupColors[existingGroupIndex].color = color;
            } else {
              // Add new group color
              kanban.tickets[id].groupColors.push({ id: groupId, color });
            }
            
            // For backward compatibility, keep the primary groupColor property as well
            // Use the most recently added group color as the primary
            kanban.tickets[id].groupColor = color;
          }
        });
        
        // Also update in main tickets array
        let ticketsArr = Array.isArray(state.tickets)
          ? state.tickets.map(t => {
              if (ticketIds.includes(t.id)) {
                // Initialize groupColors array if needed
                let groupColors = Array.isArray(t.groupColors) ? [...t.groupColors] : [];
                
                // Clean up any invalid entries
                groupColors = groupColors.filter(g => 
                  g && typeof g === 'object' && g.id && g.color
                );
                
                // Add or update this group color
                const existingGroupIndex = groupColors.findIndex(g => g.id === groupId);
                if (existingGroupIndex >= 0) {
                  groupColors[existingGroupIndex].color = color;
                } else {
                  groupColors.push({ id: groupId, color });
                }
                
                return { 
                  ...t, 
                  groupColor: color, // Keep for backward compatibility
                  groupColors 
                };
              }
              return t;
            })
          : [];
          
        return { kanban, tickets: ticketsArr };
      }),

      // Add an activity/comment to a ticket
      addTicketActivity: (ticketId, activity) => set((state) => {
        // activity: { id, type, text, author, timestamp, ... }
        const kanban = { ...state.kanban };
        const ticket = kanban.tickets[ticketId];
        if (!ticket) return {};
        const newActivity = { ...activity, id: activity.id || nanoid(), timestamp: activity.timestamp || new Date().toISOString() };
        ticket.activity = Array.isArray(ticket.activity) ? [...ticket.activity, newActivity] : [newActivity];
        kanban.tickets[ticketId] = { ...ticket };
        // Also update in main tickets array
        let ticketsArr = Array.isArray(state.tickets) ? state.tickets.map(t => t.id === ticketId ? { ...ticket } : t) : [];
        return { kanban, tickets: ticketsArr };
      }),
      
      /**
       * Clears all group colors from specified tickets
       * @param {string[]} ticketIds - Array of ticket IDs to clear colors from
       */
      clearGroupColorsForTickets: (ticketIds) => set((state) => {
        if (!ticketIds || !ticketIds.length) return {};
        
        const kanban = { ...state.kanban };
        
        // Update tickets in kanban board
        ticketIds.forEach(id => {
          if (kanban.tickets[id]) {
            // Remove all group colors
            kanban.tickets[id] = {
              ...kanban.tickets[id],
              groupColors: [],
              groupColor: undefined // Remove for backward compatibility
            };
          }
        });
        
        // Also update in main tickets array
        let ticketsArr = Array.isArray(state.tickets)
          ? state.tickets.map(t => {
              if (ticketIds.includes(t.id)) {
                return { 
                  ...t, 
                  groupColors: [],
                  groupColor: undefined // Remove for backward compatibility
                };
              }
              return t;
            })
          : [];
          
        return { kanban, tickets: ticketsArr };
      }),

      // Get activities/comments for a ticket
      getTicketActivity: (ticketId) => {
        const state = useAppStore.getState();
        const ticket = state.kanban.tickets[ticketId];
        return ticket && Array.isArray(ticket.activity) ? ticket.activity : [];
      },
      updateKanbanTicket: (ticket) => set((state) => {
        const kanban = { ...state.kanban };
        kanban.tickets[ticket.id] = { ...kanban.tickets[ticket.id], ...ticket };
        
        // Sync group colors after updating the ticket
        const updatedState = { kanban, tickets: state.tickets };
        return state._syncGroupColorsForAllTickets(updatedState);
      }),
      // New function to update relationships between tickets
      updateTicketRelationship: (sourceTicketId, targetTicketId, relationType) => set((state) => {
        // Convert tickets object to array for easier processing
        const allTickets = Object.values(state.kanban.tickets);
        
        // Use the helper function to update both sides of the relationship
        const updatedTickets = updateReciprocal(sourceTicketId, targetTicketId, relationType, allTickets);
        
        // Convert back to object for kanban state
        const updatedTicketsObj = {};
        updatedTickets.forEach(ticket => {
          updatedTicketsObj[ticket.id] = ticket;
        });
        
        // Update the tickets in kanban state
        const kanban = { ...state.kanban, tickets: updatedTicketsObj };
        
        // Also update in legacy tickets array
        let ticketsArr = [];
        if (Array.isArray(state.tickets)) {
          ticketsArr = state.tickets.map(ticket => {
            const updatedTicket = updatedTickets.find(t => t.id === ticket.id);
            return updatedTicket || ticket;
          });
        }
        
        // Sync group colors after updating relationships
        const updatedState = { kanban, tickets: ticketsArr };
        return state._syncGroupColorsForAllTickets(updatedState);
      }),
      removeKanbanTicket: (ticketId) => set((state) => {
        const kanban = { ...state.kanban };
        delete kanban.tickets[ticketId];
        Object.values(kanban.columns).forEach(col => {
          col.ticketIds = col.ticketIds.filter(id => id !== ticketId);
        });
        // Also remove from main tickets array if it exists
        let newTickets = state.tickets;
        if (Array.isArray(newTickets)) {
          newTickets = newTickets.filter(t => t.id !== ticketId);
        }
        return { kanban, tickets: newTickets };
      }),
      
      // New function to remove a ticket from the board but keep it in the main tickets array
      removeTicketFromBoard: (ticketId) => set((state) => {
        const kanban = { ...state.kanban };
        // Remove ticket from all columns but keep it in the tickets object
        const columns = [...state.kanban.columns].map(col => ({
          ...col,
          ticketIds: col.ticketIds.filter(id => id !== ticketId)
        }));
        
        // Remove ticket from the kanban tickets object to prevent it showing on the board
        if (kanban.tickets[ticketId]) {
          const { [ticketId]: removedTicket, ...remainingTickets } = kanban.tickets;
          kanban.tickets = remainingTickets;
        }
        
        return { 
          kanban: {
            ...kanban,
            columns
          }
        };
      }),
      
      addKanbanColumn: (name) => set(state => {
        const id = nanoid();
        return {
          kanban: {
            ...state.kanban,
            columns: [...state.kanban.columns, { id, name, wipLimit: null, ticketIds: [] }],
            columnOrder: [...state.kanban.columnOrder, id],
          },
        };
      }),
      removeKanbanColumn: (colId) => set(state => {
        // Prevent removing holding column if it has tickets
        if (colId === 'holding') {
          const holdingCol = state.kanban.columns.find(col => col.id === 'holding');
          if (holdingCol && holdingCol.ticketIds.length > 0) {
            // Set a flag in state to trigger notification in UI
            return { kanban: { ...state.kanban }, holdingDeleteBlocked: true };
          }
        }
        const idx = state.kanban.columnOrder.indexOf(colId);
        if (idx === -1) return {};
        const colToRemove = state.kanban.columns.find(col => col.id === colId);
        if (!colToRemove) return {};
        // Find or create holding column
        let holdingCol = state.kanban.columns.find(col => col.id === 'holding');
        let newColumns = state.kanban.columns.filter(col => col.id !== colId);
        let newColumnOrder = state.kanban.columnOrder.filter(id => id !== colId);
        if (!holdingCol) {
          holdingCol = { id: 'holding', name: 'Holding', wipLimit: null, maxTime: null, ticketIds: [] };
          newColumns.push(holdingCol);
          newColumnOrder.push('holding');
        }
        // Move tickets to holding column
        holdingCol.ticketIds = [...holdingCol.ticketIds, ...colToRemove.ticketIds];
        newColumns = newColumns.map(col => col.id === 'holding' ? holdingCol : col);
        return {
          kanban: {
            ...state.kanban,
            columns: newColumns,
            columnOrder: newColumnOrder,
          },
          holdingDeleteBlocked: false,
        };
      }),
      renameKanbanColumn: (colId, newName) => set(state => {
        return {
          kanban: {
            ...state.kanban,
            columns: state.kanban.columns.map(col => col.id === colId ? { ...col, name: newName } : col),
          },
        };
      }),
      moveKanbanColumn: (colId, dir) => set(state => {
        const idx = state.kanban.columnOrder.indexOf(colId);
        if (idx === -1) return {};
        const newOrder = [...state.kanban.columnOrder];
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= newOrder.length) return {};
        newOrder.splice(idx, 1);
        newOrder.splice(newIdx, 0, colId);
        return {
          kanban: {
            ...state.kanban,
            columnOrder: newOrder,
          },
        };
      }),
      setKanbanColumnWipLimit: (colId, wipLimit) => set(state => {
        return {
          kanban: {
            ...state.kanban,
            columns: state.kanban.columns.map(col => col.id === colId ? { ...col, wipLimit } : col),
          },
        };
      }),
    }),
    {
      name: 'repair-tracker-store-' + Date.now(), // Force a new storage key to bypass persisted data
      partialize: (state) => ({
        tickets: state.tickets,
        customers: state.customers,
      }),
    }
  )
  );
}

// Export the store
export const useAppStore = createStoreWithStableReferences();
