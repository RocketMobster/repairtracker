/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    'bg-red-500', 'text-white', 'px-3', 'py-1', 'rounded',
    'bg-blue-600', 'max-w-md', 'mx-auto', 'p-8', 'text-2xl', 'font-bold', 'mb-4', 'w-full', 'border', 'space-y-4', 'text-red-600', 'text-blue-700', 'text-blue-900', 'bg-white', 'shadow', 'mb-6', 'min-h-screen', 'bg-gradient-to-br', 'from-blue-100', 'to-blue-300', 'py-2', 'rounded', 'text-sm', 'text-gray-500'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}