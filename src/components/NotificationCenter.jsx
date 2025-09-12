import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function NotificationCenter() {
  const notifications = useAppStore(state => state.notifications);
  const markNotificationRead = useAppStore(state => state.markNotificationRead);
  const markAllNotificationsRead = useAppStore(state => state.markAllNotificationsRead);
  const clearNotifications = useAppStore(state => state.clearNotifications);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNotificationClick = (notification) => {
    // Mark as read
    markNotificationRead(notification.id);
    
    // Navigate to ticket if there's a ticketId
    if (notification.ticketId) {
      navigate(`/tickets/${notification.ticketId}`);
      setIsOpen(false);
    }
    
    // For related ticket notifications, you might want to navigate to the related ticket
    if (notification.relatedTicketId) {
      navigate(`/tickets/${notification.relatedTicketId}`);
      setIsOpen(false);
    }
  };
  
  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell icon with notification count */}
      <button 
        className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        title={`${unreadCount} unread notifications`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown for notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 border-b border-gray-200">
            <div className="px-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-4 px-4 text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              <ul>
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`border-b border-gray-100 last:border-0 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex flex-col"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900">{notification.title}</span>
                        <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {!notification.read && (
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 ml-2"></span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="py-2 px-4 bg-gray-50 text-xs text-gray-500">
            <p>Note: User-specific notifications will be enhanced when the user management system is fully implemented.</p>
          </div>
        </div>
      )}
    </div>
  );
}