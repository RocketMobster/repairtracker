import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      region: 'US',
      setRegion: (region) => set({ region }),
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
