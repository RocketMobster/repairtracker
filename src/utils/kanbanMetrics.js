// src/utils/kanbanMetrics.js

/**
 * Returns the number of high priority tickets in the kanban board.
 * @param {object} kanban - The kanban state object
 */
export function getHighPriorityCount(kanban) {
  return Object.values(kanban.tickets || {}).filter(t => t.highPriority).length;
}

/**
 * Returns the number of normal (not high priority) tickets in the kanban board.
 * @param {object} kanban - The kanban state object
 */
export function getNormalPriorityCount(kanban) {
  return Object.values(kanban.tickets || {}).filter(t => !t.highPriority).length;
}

/**
 * Returns the total number of tickets in the kanban board.
 * @param {object} kanban - The kanban state object
 */
export function getTotalTicketCount(kanban) {
  return Object.keys(kanban.tickets || {}).length;
}
