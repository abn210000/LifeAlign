export const categories = [
    { label: 'Wellness', value: 'wellness', color: '#4A90E2' }, // blue
    { label: 'Grocery', value: 'grocery', color: '#2ECC71' },   // green
    { label: 'Home', value: 'home', color: '#F1C40F' },        // yellow
    { label: 'Car', value: 'car', color: '#E74C3C' },          // red
  ];
  
  export const getCategoryColor = (categoryValue: string): string => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category?.color || '#6b917f'; // default color if category not found
  };