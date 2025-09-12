# RMA Repair Tracker Style Guide

This document outlines the styling patterns and design decisions used throughout the RMA Repair Tracker application. Follow these guidelines to maintain consistency when modifying existing components or creating new ones.

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Layout & Spacing](#layout--spacing)
- [Component Styling](#component-styling)
  - [Cards & Containers](#cards--containers)
  - [Forms & Inputs](#forms--inputs)
  - [Buttons](#buttons)
  - [Status Indicators & Badges](#status-indicators--badges)
  - [Modals & Overlays](#modals--overlays)
- [Animation & Transitions](#animation--transitions)
- [Mobile Responsiveness](#mobile-responsiveness)
- [Accessibility Considerations](#accessibility-considerations)

## Color Palette

The application uses a color palette based on Tailwind CSS defaults with strategic use of color for functional purposes:

### Primary Colors
// Clean up relationships for saving to the database
// Returns an array of cleaned relationships with duplicates removed and priority set
function cleanupRelationships(relationships) {
  console.log('CLEANUP: Starting relationship cleanup with', relationships.length, 'relationships');
  
  // First pass: filter duplicates using our existing function
  const filteredMap = filterDuplicateRelationships(relationships);
  
  // Convert map values back to an array
  const cleanedRelationships = Array.from(filteredMap.values()).map(rel => {
    // Remove any temporary properties that shouldn't be saved
    const { originalIndex, ...cleanRel } = rel;
    return cleanRel;
  });
  
  console.log('CLEANUP: After deduplication, have', cleanedRelationships.length, 'relationships');
  
  // Return the cleaned array of relationships
  return cleanedRelationships;
}
- **Blue**: `#3B82F6` (blue-500) - Primary action color, used for main buttons, links, and highlighting important actions
- **White**: `#FFFFFF` - Background for cards and content areas
- **Gray**: Various shades from `#F3F4F6` (gray-100) to `#374151` (gray-700) for UI elements and text

### Functional Colors

- **Red**: `#EF4444` (red-500) - Used for errors, warnings, delete actions, and high priority indicators
- **Green**: `#22C55E` (green-500) - Success indicators, "done" status
- **Yellow**: `#FACC15` (yellow-400) - Warnings, attention needed, related tickets section
- **Purple**: `#D946EF` (purple-500) - Used for custom fields/additional information sections

### Relationship Color Coding

For ticket relationships, a preset color palette is available:
```javascript
["#EF4444", "#F59E42", "#FACC15", "#22C55E", "#3B82F6", "#6366F1", "#6B7280", "#D946EF"]
```

## Typography

The application uses Tailwind's default font stack, relying on system fonts for optimal performance:

### Font Sizes

- **Headings**: 
  - Main headings: `text-2xl font-bold` (24px)
  - Section headings: `text-xl font-bold` or `font-semibold text-gray-700`
  - Card titles: `text-lg font-bold` or `text-base font-bold`
  
- **Body Text**:
  - Standard text: `text-base` (16px)
  - Secondary text: `text-sm text-gray-600` (14px)
  - Small/meta text: `text-xs text-gray-500` (12px)

### Font Weights

- `font-bold` - Headings, important information
- `font-semibold` - Section headers, emphasized text
- `font-normal` - Regular body text

## Layout & Spacing

### Container Widths

- Main content area: `max-w-3xl mx-auto p-4`
- Cards/sections: 100% width within container
- Modals: `max-w-lg w-full` for standard dialogs

### Spacing System

Following Tailwind's spacing scale:

- Tight spacing (between related elements): `gap-2` (0.5rem)
- Standard padding (inside cards): `p-4` or `p-6`
- Section spacing: `mb-4` (1rem)
- Form field spacing: `space-y-4`

### Grid Layouts

- For multi-column data: `grid grid-cols-2 gap-4`

## Component Styling

### Cards & Containers

#### Standard Card

```html
<div className="bg-white p-6 rounded shadow">
  <!-- Card content here -->
</div>
```

#### Section Container

```html
<div className="mb-4">
  <div className="font-semibold text-gray-700 mb-2">Section Title:</div>
  <div className="pl-2 border-l-4 border-blue-500">
    <!-- Section content here -->
  </div>
</div>
```

Note the use of colored left borders to visually distinguish different types of content sections:
- Customer info: `border-blue-500`
- Item details: `border-green-500`
- Custom fields: `border-purple-500`
- Related tickets: `border-yellow-500`

#### Kanban Ticket Card

```html
<div className="bg-white rounded shadow p-3 mb-1 cursor-pointer select-none transition-all">
  <!-- Card content -->
</div>
```

With hover/active states:
```html
<div className={
  'bg-white rounded shadow p-3 mb-1 cursor-pointer select-none transition-all ' +
  (isDragging ? 'ring-2 ring-blue-400' : '')
}>
  <!-- Card content -->
</div>
```

### Forms & Inputs

#### Text Input

```html
<input
  className="border px-2 py-1 rounded w-full"
  placeholder="Placeholder text..."
  value={value}
  onChange={handleChange}
/>
```

#### Select Dropdown

```html
<select
  className="border px-2 py-1 rounded"
  value={value}
  onChange={handleChange}
>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

#### Form Section

```html
<div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200">
  <div className="font-bold mb-2 text-sm uppercase tracking-wide text-blue-700">Section Title</div>
  <!-- Form fields -->
</div>
```

### Buttons

#### Primary Button

```html
<button
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  onClick={handleClick}
>
  Primary Action
</button>
```

#### Secondary Button

```html
<button
  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
  onClick={handleClick}
>
  Secondary Action
</button>
```

#### Small/Action Button

```html
<button
  className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
  onClick={handleClick}
  title="Tooltip text explaining action"
>
  Action
</button>
```

#### Link Button

```html
<button className="text-blue-600 underline text-sm" onClick={handleClick}>
  + Add Item
</button>
```

#### Icon Button

```html
<button className="text-red-600" onClick={handleRemoveItem} title="Remove">✕</button>
```

### Status Indicators & Badges

#### Status Badge

```html
<span className="text-xs px-2 py-0.5 rounded-full text-xs font-semibold">
  Status
</span>
```

With color variations:
```html
<span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
  Status
</span>
```

#### Priority Indicator

```html
<button
  className={
    'ml-2 px-2 py-0.5 rounded text-xs font-bold flex items-center ' +
    (isHighPriority
      ? 'bg-red-200 text-red-700 border border-red-400'
      : 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-yellow-100 hover:text-yellow-600')
  }
>
  <svg><!-- Icon --></svg>
  {isHighPriority && 'HIGH'}
</button>
```

#### Group Color Pill

```html
<span
  className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold"
  style={{ 
    backgroundColor: color, 
    color: '#fff', 
    border: `2px solid ${color}` 
  }}
  title="This ticket is part of a group"
>
  Group
</span>
```

### Modals & Overlays

#### Modal Container

```html
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
    <!-- Modal content -->
  </div>
</div>
```

#### Preview Modal

```html
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
  <div
    className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 relative"
    onClick={e => e.stopPropagation()}
  >
    <!-- Modal content -->
  </div>
</div>
```

#### Close Button for Modals

```html
<button
  className="absolute top-1 right-1 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 text-3xl font-bold"
  onClick={onClose}
>
  ×
</button>
```

## Animation & Transitions

### Hover Effects

- Buttons: `hover:bg-blue-700` (darker shade on hover)
- Cards: `hover:bg-blue-100` (light highlight on hover)
- Link text: Default browser behavior

### Transitions

- General transitions: `transition-all`
- For drag-and-drop: 
  ```javascript
  style={{
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  }}
  ```

## Mobile Responsiveness

The application uses a responsive approach through:

- Fluid containers with `max-width` constraints
- Percentage-based widths
- Grid layouts that adapt to screen size
- Appropriate padding and spacing for touch interfaces

## Accessibility Considerations

- Appropriate color contrast ratios
- Semantic HTML structure
- Descriptive `title` attributes for interactive elements
- Colorblind-friendly palette for group colors
- Focus indicators for keyboard navigation
- Clear, readable font sizes
- `aria-label` attributes where needed

---

This style guide should be considered a living document - update it as the application evolves to ensure consistent styling across all components.
