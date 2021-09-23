const defaultCollections = {
  seasons: ['spring', 'summer', 'autumn', 'winter'],
  colours: ['red', 'yellow', 'green', 'blue'],
  animals: ['cat', 'tiger', 'cheetah', 'dog', 'fox', 'wolf', 'cow', 'wildebeest', 'buffalo'],
  structures: ['bridge', 'building', 'staircase', 'tower']
};
const KEY_COLLECTIONS = 'collections';
const { localStorage } = window;

const writeDefaultCollectionsToLocalStorage = () => {
  localStorage.setItem(KEY_COLLECTIONS, JSON.stringify(defaultCollections));
  return defaultCollections;
};

export const getCollectionsFromLocalStorage = () => {
  const rawData = localStorage.getItem(KEY_COLLECTIONS);
  if (rawData) {
    try {
      return JSON.parse(rawData);
    } catch (e) {
      console.warn('Data in local storage corrupted, falling back to default collections');
    }
  }
  return writeDefaultCollectionsToLocalStorage();
};
