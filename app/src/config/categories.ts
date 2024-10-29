export const categories = [
  { label: 'Home', value: 'household', color: '#ee6b6e' },
  { label: 'Car', value: 'car', color: '#F9E076' },
  { label: 'Grocery', value: 'grocery', color: '#85C285' },
  { label: 'Health', value: 'health', color: '#51A0D5' },
];

export const getCategoryColor = (category: string) => {
  const foundCategory = categories.find(c => c.value === category);
  return foundCategory ? foundCategory.color : '#000000';
};