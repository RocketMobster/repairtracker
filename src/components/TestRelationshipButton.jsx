import React from 'react';
import { useAppStore } from '../store';
import { toast } from 'react-toastify';

/**
 * Creates test tickets with blocking relationships to demonstrate and test the blocking functionality
 */
export default function TestRelationshipButton() {
  // Create a set of test tickets with relationships
  const createTestTickets = () => {
    const store = useAppStore.getState();
    const columns = store.kanban.columns;
    
    // Find a non-completion column to place our tickets
    const sourceCol = columns.find(col => 
      !store.blockingConfig.closedColumnIds.includes(col.id) && 
      !store.blockingConfig.shippingColumnIds.includes(col.id)
    );
    
    if (!sourceCol) {
      toast.error("Please create at least one non-completion column first", {
        position: "bottom-right",
        autoClose: 5000,
      });
      return;
    }
    
    // Create parent ticket
    const parentTicket = {
      id: 'test-parent-' + Date.now(),
      rmaNumber: 'P123',
      company: 'Test Parent',
      item: 'Main Unit',
      reason: 'Needs repair',
      createdAt: new Date().toISOString(),
      relatedTickets: []
    };
    
    // Create a child ticket that blocks the parent
    const childTicket1 = {
      id: 'test-child1-' + Date.now(),
      rmaNumber: 'C456',
      company: 'Test Child 1',
      item: 'Component A',
      reason: 'Part of parent repair',
      createdAt: new Date().toISOString(),
      relatedTickets: [
        {
          id: parentTicket.id,
          type: 'blocks', // This ticket blocks the parent
          note: 'Parent requires this component'
        }
      ]
    };
    
    // Create another child ticket that blocks the parent
    const childTicket2 = {
      id: 'test-child2-' + Date.now(),
      rmaNumber: 'C789',
      company: 'Test Child 2',
      item: 'Component B',
      reason: 'Part of parent repair',
      createdAt: new Date().toISOString(),
      relatedTickets: [
        {
          id: parentTicket.id,
          type: 'blocks', // This ticket blocks the parent
          note: 'Parent requires this component'
        }
      ]
    };
    
    // Update parent to know about its children
    parentTicket.relatedTickets = [
      {
        id: childTicket1.id,
        type: 'blockedBy', // Parent is blocked by child 1
        note: 'Requires this component'
      },
      {
        id: childTicket2.id,
        type: 'blockedBy', // Parent is blocked by child 2
        note: 'Requires this component'
      }
    ];
    
    // Add tickets to the store
    const tickets = { ...store.kanban.tickets };
    tickets[parentTicket.id] = parentTicket;
    tickets[childTicket1.id] = childTicket1;
    tickets[childTicket2.id] = childTicket2;
    
    // Add tickets to the source column
    const updatedColumns = [...columns];
    const sourceColIndex = updatedColumns.findIndex(col => col.id === sourceCol.id);
    if (sourceColIndex !== -1) {
      updatedColumns[sourceColIndex] = {
        ...updatedColumns[sourceColIndex],
        ticketIds: [
          ...updatedColumns[sourceColIndex].ticketIds,
          parentTicket.id,
          childTicket1.id,
          childTicket2.id
        ]
      };
    }
    
    // Update the store
    useAppStore.setState({
      kanban: {
        ...store.kanban,
        columns: updatedColumns,
        tickets
      }
    });
    
    toast.success("Created test tickets with blocking relationships", {
      position: "bottom-right",
      autoClose: 5000,
    });
  };
  
  return (
    <button
      onClick={createTestTickets}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm"
    >
      Create Test Tickets
    </button>
  );
}
