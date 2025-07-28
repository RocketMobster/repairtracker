import { create } from 'zustand'

// Example roles: Admin, Technician, Viewer, FrontDesk, Guest
export const useAppStore = create((set) => ({
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
}))
