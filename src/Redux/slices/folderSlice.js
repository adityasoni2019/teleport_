import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = (state) => {
  localStorage.setItem('folders', JSON.stringify(state.folders));
  localStorage.setItem('favoriteFiles', JSON.stringify(state.favoriteFiles));
  localStorage.setItem('archivedFiles', JSON.stringify(state.archivedFiles));
};

const defaultNotesFolder = {
  id: 'default-notes',
  name: 'Notes',
  files: []
};

const folderSlice = createSlice({
  name: 'folders', // this ideally could be anything. 
  // as in, even if I change the name to anything else, it wouldn't matter. 
  initialState: {
    folders: JSON.parse(localStorage.getItem('folders')) || [defaultNotesFolder],
    // selectedFolder: JSON.parse(localStorage.getItem('selectedFolder')) || null,
    selectedFolder: null,
    selectedFile: null,
    archivedFiles: JSON.parse(localStorage.getItem('archivedFiles')) || [],
    favoriteFiles: JSON.parse(localStorage.getItem('favoriteFiles')) || [],
  },
  reducers: {
    addFolder: (state, action) => {
      state.folders.push(action.payload);
      updateLocalStorage(state);
    },
    selectFolder: (state, action) => {
      state.selectedFolder = action.payload;
      // updateLocalStorage(state);
    },
    addFile: (state, action) => {
      const { folderId, file } = action.payload;
      const folder = state.folders.find(f => f.id === folderId);
      if (folder) {
        if (!Array.isArray(folder.files)) {
          folder.files = [];
        }
        folder.files.push(file);
      }
      updateLocalStorage(state);
    },
    selectFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    updateFileContent: (state, action) => {
      const { fileId, content } = action.payload;
      const folder = state.folders.find(f => f.files && f.files.some(file => file.id === fileId));
      if (folder) {
        const file = folder.files.find(f => f.id === fileId);
        if (file) {
          file.content = content;
        }
      }
      updateLocalStorage(state);
    },
    deleteFile: (state, action) => {
      const { folderId, fileId } = action.payload;
      const folder = state.folders.find(f => f.id === folderId);
      if (folder && folder.files) {
        folder.files = folder.files.filter(f => f.id !== fileId);
        if (state.selectedFile === fileId) {
          state.selectedFile = null;
        }
      }
      updateLocalStorage(state);
    },
    deleteFolder: (state, action) => {
      const folderId = action.payload;
      state.folders = state.folders.filter(f => f.id !== folderId);
      if (state.selectedFolder === folderId) {
        state.selectedFolder = null;
        state.selectedFile = null;
      }
      updateLocalStorage(state);
    },
    reorderFolders: (state, action) => {
      const { sourceIndex, targetIndex } = action.payload;
      const [removed] = state.folders.splice(sourceIndex, 1);
      state.folders.splice(targetIndex, 0, removed);
      updateLocalStorage(state);
    },
    reorderFiles: (state, action) => {
      const { folderId, sourceIndex, targetIndex } = action.payload;
      const folder = state.folders.find(f => f.id === folderId);
      if (folder && folder.files) {
        const [removed] = folder.files.splice(sourceIndex, 1);
        folder.files.splice(targetIndex, 0, removed);
        updateLocalStorage(state);
      }
    },
    archiveFile: (state, action) => {
      const { fileId, folderId } = action.payload;
      let fileToArchive = null;
      let originalFolderId = null;

      for (const folder of state.folders) {
        const file = folder.files?.find(f => f.id === fileId);
        if (file) {
          fileToArchive = file;
          originalFolderId = folder.id;
          folder.files = folder.files.filter(f => f.id !== fileId);
          break;
        }
      }

      if (fileToArchive) {
        state.archivedFiles.push({ ...fileToArchive, originalFolderId });
      }

      updateLocalStorage(state);
    },
    toggleFavorite: (state, action) => {
      const fileId = action.payload;
      const isFavorite = state.favoriteFiles.some(f => f.id === fileId);
      if (isFavorite) {
        state.favoriteFiles = state.favoriteFiles.filter(f => f.id !== fileId);
      } else {
        const file = state.folders.flatMap(f => f.files).find(f => f.id === fileId);
        if (file) {
          state.favoriteFiles.push(file);
        }
      }
      updateLocalStorage(state);
    },
    unarchiveFile: (state, action) => {
      const fileId = action.payload;
      const fileIndex = state.archivedFiles.findIndex(f => f.id === fileId);
      if (fileIndex !== -1) {
        const [fileToUnarchive] = state.archivedFiles.splice(fileIndex, 1);
        const targetFolder = state.folders.find(f => f.id === fileToUnarchive.originalFolderId);
        if (targetFolder) {
          if (!Array.isArray(targetFolder.files)) {
            targetFolder.files = [];
          }
          targetFolder.files.push(fileToUnarchive);
        } else {
          if (state.folders.length > 0) {
            if (!Array.isArray(state.folders[0].files)) {
              state.folders[0].files = [];
            }
            state.folders[0].files.push(fileToUnarchive);
          }
        }
      }
      updateLocalStorage(state);
    },
  },
});

export const { addFolder, selectFolder, addFile, selectFile, updateFileContent, deleteFile, deleteFolder, reorderFolders, reorderFiles, archiveFile, toggleFavorite, unarchiveFile } = folderSlice.actions;

export const selectSelectedFile = (state) => {
  if (state.folders.selectedFolder === 'archive') {
    return state.folders.archivedFiles.find(f => f.id === state.folders.selectedFile);
  } else if (state.folders.selectedFolder === 'favorites') {
    return state.folders.favoriteFiles.find(f => f.id === state.folders.selectedFile);
  }
  return state.folders.folders
    .flatMap(folder => folder.files)
    .find(file => file.id === state.folders.selectedFile);
};

export default folderSlice.reducer;