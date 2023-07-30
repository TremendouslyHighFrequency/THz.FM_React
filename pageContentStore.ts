// pageContentStore.ts
import create from 'zustand';

// Define the Zustand store for managing the content of the page-content area
export const usePageContentStore = create((set) => ({
  content: '',

  // Action to set the content
  setContent: (newContent: string) => {
    set({ content: newContent });
  },
}));
