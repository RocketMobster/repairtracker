import React, { useState } from 'react';
import { useAppStore } from '../store';
import TestRelationshipButton from './TestRelationshipButton';

/**
 * A simple panel to configure and test relationship blocking behavior
 */
export default function BlockingConfigPanel() {
  const blockingConfig = useAppStore(s => s.blockingConfig);
  const updateBlockingConfig = useAppStore(s => s.updateBlockingConfig);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggleSetting = (setting) => {
    updateBlockingConfig({ [setting]: !blockingConfig[setting] });
  };
  
  const addTestColumn = (type) => {
    // Get state directly without causing re-renders
    const state = useAppStore.getState();
    const columns = state.kanban.columns;
    
    // Check if column already exists
    if (columns.some(col => col.id === type)) {
      return;
    }
    
    // Add the column
    const newColumn = { 
      id: type, 
      name: type === 'shipping' ? 'Ready to Ship' : 'Completed',
      wipLimit: null, 
      maxTime: null, 
      ticketIds: [], 
      defaultForNewTickets: false 
    };
    
    // Update the store
    useAppStore.setState(state => {
      // Create new columnOrder with the new column
      const newColumnOrder = [...state.kanban.columnOrder];
      if (!newColumnOrder.includes(type)) {
        newColumnOrder.push(type);
      }
      
      return {
        kanban: {
          ...state.kanban,
          columns: [...state.kanban.columns, newColumn],
          columnOrder: newColumnOrder
        }
      };
    });
    
    // Update the blocking config to recognize this column
    if (type === 'shipping') {
      const currentShippingIds = blockingConfig.shippingColumnIds || [];
      if (!currentShippingIds.includes(type)) {
        updateBlockingConfig({ 
          shippingColumnIds: [...currentShippingIds, type] 
        });
      }
    } else if (type === 'done') {
      const currentClosedIds = blockingConfig.closedColumnIds || [];
      if (!currentClosedIds.includes(type)) {
        updateBlockingConfig({ 
          closedColumnIds: [...currentClosedIds, type] 
        });
      }
    }
  };
  
  if (!isExpanded) {
    return (
      <button 
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-[100] flex items-center justify-center"
        onClick={() => setIsExpanded(true)}
        title="Blocking Configuration"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-[100] w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Relationship Blocking Config</h3>
        <button 
          className="text-gray-600 hover:text-gray-800"
          onClick={() => setIsExpanded(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">
          This panel allows testing the blocking configuration without an admin panel.
        </p>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <label className="text-sm">
            Prevent closing tickets that block others
          </label>
          <div 
            className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${blockingConfig.preventClosingBlockingTickets ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => handleToggleSetting('preventClosingBlockingTickets')}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${blockingConfig.preventClosingBlockingTickets ? 'translate-x-5' : 'translate-x-1'}`}
              style={{ marginTop: '0.125rem' }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">
            Prevent closing tickets that are blocked
          </label>
          <div 
            className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${blockingConfig.preventClosingBlockedTickets ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => handleToggleSetting('preventClosingBlockedTickets')}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${blockingConfig.preventClosingBlockedTickets ? 'translate-x-5' : 'translate-x-1'}`}
              style={{ marginTop: '0.125rem' }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">
            Prevent shipping tickets that block others
          </label>
          <div 
            className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${blockingConfig.preventShippingBlockingTickets ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => handleToggleSetting('preventShippingBlockingTickets')}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${blockingConfig.preventShippingBlockingTickets ? 'translate-x-5' : 'translate-x-1'}`}
              style={{ marginTop: '0.125rem' }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">
            Prevent shipping tickets that are blocked
          </label>
          <div 
            className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${blockingConfig.preventShippingBlockedTickets ? 'bg-blue-600' : 'bg-gray-300'}`}
            onClick={() => handleToggleSetting('preventShippingBlockedTickets')}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${blockingConfig.preventShippingBlockedTickets ? 'translate-x-5' : 'translate-x-1'}`}
              style={{ marginTop: '0.125rem' }}
            />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-3">
        <p className="text-sm font-semibold mb-2">Testing Columns</p>
        <div className="flex space-x-2">
          <button
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm"
            onClick={() => addTestColumn('done')}
          >
            Add "Done" Column
          </button>
          <button
            className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm"
            onClick={() => addTestColumn('shipping')}
          >
            Add "Shipping" Column
          </button>
        </div>
      </div>
      
      <div className="border-t pt-3 mt-3">
        <p className="text-sm font-semibold mb-2">Testing Relationships</p>
        <div className="flex">
          <TestRelationshipButton />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This will create test tickets with blocking relationships to demonstrate 
          how the blocking system works.
        </p>
      </div>
      
      <div className="border-t mt-3 pt-3 text-xs text-gray-500">
        <p>Current Configuration:</p>
        <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
          {JSON.stringify({
            closedColumnIds: blockingConfig.closedColumnIds,
            shippingColumnIds: blockingConfig.shippingColumnIds
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
