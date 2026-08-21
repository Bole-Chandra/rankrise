const API_ORIGIN = import.meta.env.VITE_API_URL || '';

export const getFileSrc = (file) => {
  if (!file) return '';
  if (file.startsWith('http') || file.startsWith('data:')) return file;
  return `${API_ORIGIN}${file}`;
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};