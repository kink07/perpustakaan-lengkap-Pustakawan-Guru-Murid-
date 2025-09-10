export interface DDCCategory {
  value: string;
  label: string;
}

export const DDC_CATEGORIES: DDCCategory[] = [
  { value: 'all', label: 'Semua Kategori' },
  { value: '000', label: '000 - Computer Science, Information & General Works' },
  { value: '100', label: '100 - Philosophy & Psychology' },
  { value: '200', label: '200 - Religion' },
  { value: '300', label: '300 - Social Sciences' },
  { value: '400', label: '400 - Language' },
  { value: '500', label: '500 - Pure Science' },
  { value: '600', label: '600 - Technology' },
  { value: '700', label: '700 - Arts & Recreation' },
  { value: '800', label: '800 - Literature' },
  { value: '900', label: '900 - History & Geography' }
];

export const getCategoryLabel = (value: string): string => {
  const category = DDC_CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};