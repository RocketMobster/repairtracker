import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { toast } from 'react-toastify';

/**
 * Displays a tooltip with explanation when a ticket couldn't be moved due to blocking relationships
 */
export default function BlockingNotificationTooltip() {
  const lastBlockingNotifications = useAppStore(state => state.lastBlockingNotifications);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Process the notifications from the store
    const activeNotifications = [];
    const now = Date.now();
    
    // Look for recent notifications (last 10 seconds)
    Object.keys(lastBlockingNotifications).forEach(ticketId => {
      const notification = lastBlockingNotifications[ticketId];
      if (notification && now - notification.timestamp < 10000) {
        activeNotifications.push({
          id: ticketId,
          ...notification
        });
      }
    });
    
    setNotifications(activeNotifications);
    
    // Clean up after 10 seconds
    const timer = setTimeout(() => {
      setNotifications([]);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [lastBlockingNotifications]);
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-md mb-2 rounded-r"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
