import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid';

// Example roles: Admin, Technician, Viewer, FrontDesk, Guest
export const useAppStore = create(
  persist(
    (set) => ({
      currentUser: null, // { id, username, role }
      tickets: [],
      customers: [],
      users: [],
      statuses: [],
      plugins: [],
      rolePermissions: {},
      // Add more state as needed
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
          { id: 'backlog', name: 'Backlog', wipLimit: null, maxTime: null, ticketIds: ['t1', 't2'] },
          { id: 'inProgress', name: 'In Progress', wipLimit: null, maxTime: null, ticketIds: ['t3', 't4'] },
          { id: 'review', name: 'Review', wipLimit: null, maxTime: null, ticketIds: ['t5'] },
          { id: 'done', name: 'Done', wipLimit: null, maxTime: null, ticketIds: ['t6'] }
        ],
        columnOrder: ['backlog', 'inProgress', 'review', 'done'],
        tickets: {
          t1: { id: 't1', title: 'Replace LCD Panel', rma: 'RMA-1001', company: 'Acme Corp', highPriority: true, createdAt: '2025-08-01T09:00:00Z', assignedTo: 'Alice', receivedAt: '2025-08-01T09:00:00Z', statusHistory: [{ columnId: 'backlog', enteredAt: '2025-08-01T09:00:00Z' }] },
          t2: { id: 't2', title: 'Battery Not Charging', rma: 'RMA-1002', company: 'Beta LLC', highPriority: false, createdAt: '2025-08-02T10:00:00Z', assignedTo: 'Bob', receivedAt: '2025-08-02T10:00:00Z', statusHistory: [{ columnId: 'backlog', enteredAt: '2025-08-02T10:00:00Z' }] },
          t3: { id: 't3', title: 'No Power', rma: 'RMA-1003', company: 'Acme Corp', highPriority: false, createdAt: '2025-08-03T11:00:00Z', assignedTo: 'Charlie', receivedAt: '2025-08-03T11:00:00Z', statusHistory: [{ columnId: 'inProgress', enteredAt: '2025-08-03T11:00:00Z' }] },
          t4: { id: 't4', title: 'Keyboard Replacement', rma: 'RMA-1004', company: 'Delta Inc', highPriority: false, createdAt: '2025-08-04T12:00:00Z', assignedTo: 'Alice', receivedAt: '2025-08-04T12:00:00Z', statusHistory: [{ columnId: 'inProgress', enteredAt: '2025-08-04T12:00:00Z' }] },
          t5: { id: 't5', title: 'Screen Flicker', rma: 'RMA-1005', company: 'Gamma Ltd', highPriority: true, createdAt: '2025-08-05T13:00:00Z', assignedTo: 'Bob', receivedAt: '2025-08-05T13:00:00Z', statusHistory: [{ columnId: 'review', enteredAt: '2025-08-05T13:00:00Z' }] },
          t6: { id: 't6', title: 'Speaker Distortion', rma: 'RMA-1006', company: 'Acme Corp', highPriority: false, createdAt: '2025-08-06T14:00:00Z', assignedTo: 'Charlie', receivedAt: '2025-08-06T14:00:00Z', statusHistory: [{ columnId: 'done', enteredAt: '2025-08-06T14:00:00Z' }] },
        }
      },

      // Kanban Actions
      updateKanbanColumnTitle: (colId, newTitle) => set((state) => {
        const kanban = { ...state.kanban };
        if (kanban.columns[colId]) {
          kanban.columns[colId] = { ...kanban.columns[colId], title: newTitle };
        }
        return { kanban };
      }),
      setKanban: (kanban) => set({ kanban }),
      moveTicket: (ticketId, toColId, toIdx) => set(state => {
        const fromCol = state.kanban.columns.find(col => col.ticketIds.includes(ticketId));
        const toCol = state.kanban.columns.find(col => col.id === toColId);
        if (!fromCol || !toCol) return {};
        // Enforce WIP limit
        if (toCol.wipLimit && toCol.ticketIds.length >= toCol.wipLimit) {
          return {}; // Block move
        }
        // Remove from old column
        fromCol.ticketIds = fromCol.ticketIds.filter(id => id !== ticketId);
        // Insert into new column
        toCol.ticketIds = [
          ...toCol.ticketIds.slice(0, toIdx),
          ticketId,
          ...toCol.ticketIds.slice(toIdx)
        ];
        // Update ticket statusHistory
        const ticket = state.kanban.tickets[ticketId];
        if (ticket && (!ticket.statusHistory || ticket.statusHistory[ticket.statusHistory.length - 1]?.columnId !== toColId)) {
          const now = new Date().toISOString();
          ticket.statusHistory = [
            ...(ticket.statusHistory || []),
            { columnId: toColId, enteredAt: now }
          ];
        }
        return { kanban: { ...state.kanban, columns: [...state.kanban.columns], tickets: { ...state.kanban.tickets, [ticketId]: { ...ticket } } } };
      }),
      reorderTicket: (colId, startIndex, endIndex) => set((state) => {
        const kanban = { ...state.kanban };
        const ticketIds = Array.from(kanban.columns[colId].ticketIds);
        const [removed] = ticketIds.splice(startIndex, 1);
        ticketIds.splice(endIndex, 0, removed);
        kanban.columns[colId].ticketIds = ticketIds;
        return { kanban };
      }),
      addKanbanTicket: (ticket) => set((state) => {
        const kanban = { ...state.kanban };
        kanban.tickets[ticket.id] = ticket;
        kanban.columns['backlog'].ticketIds.push(ticket.id);
        return { kanban };
      }),
      updateKanbanTicket: (ticket) => set((state) => {
        const kanban = { ...state.kanban };
        kanban.tickets[ticket.id] = { ...kanban.tickets[ticket.id], ...ticket };
        return { kanban };
      }),
      removeKanbanTicket: (ticketId) => set((state) => {
        const kanban = { ...state.kanban };
        delete kanban.tickets[ticketId];
        Object.values(kanban.columns).forEach(col => {
          col.ticketIds = col.ticketIds.filter(id => id !== ticketId);
        });
        return { kanban };
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
      name: 'repair-tracker-store',
      partialize: (state) => ({
        tickets: state.tickets,
        customers: state.customers,
      }),
    }
  )
)
