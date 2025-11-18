import { create } from 'zustand';

export const useFileStore = create((set) => ({
  files: [],
  currentFolder: null,
  selectedFiles: [],
  viewMode: 'grid', // 'grid' o 'list'

  setFiles: (files) => set({ files }),
  
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  
  addFile: (file) => set((state) => ({ 
    files: [file, ...state.files] 
  })),
  
  updateFile: (id, updates) => set((state) => ({
    files: state.files.map((file) =>
      file.id === id ? { ...file, ...updates } : file
    ),
  })),
  
  removeFile: (id) => set((state) => ({
    files: state.files.filter((file) => file.id !== id),
  })),
  
  toggleSelectFile: (id) => set((state) => {
    const isSelected = state.selectedFiles.includes(id);
    return {
      selectedFiles: isSelected
        ? state.selectedFiles.filter((fileId) => fileId !== id)
        : [...state.selectedFiles, id],
    };
  }),
  
  clearSelection: () => set({ selectedFiles: [] }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
}));