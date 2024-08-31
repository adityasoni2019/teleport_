import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addFolder,
  selectFolder,
  deleteFolder,
  reorderFolders,
  selectFile,
  archiveFile,
} from "../Redux/slices/folderSlice";
import { FaTrash, FaFolder, FaStar, FaArchive } from "react-icons/fa";

function LeftPanel() {
  const [newFolderName, setNewFolderName] = useState("");
  const folders = useSelector((state) => state.folders.folders);
  const selectedFolder = useSelector((state) => state.folders.selectedFolder);
  const favoriteFiles = useSelector((state) => state.folders.favoriteFiles);
  const archivedFiles = useSelector((state) => state.folders.archivedFiles);
  const dispatch = useDispatch();
  const [draggedFolder, setDraggedFolder] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim() !== "") {
      const newFolder = { id: Date.now(), name: newFolderName, files: [] };
      dispatch(addFolder(newFolder));
      setNewFolderName("");
    }
  };

  const handleDeleteFolder = (e, folderId) => {
    e.stopPropagation();
    dispatch(deleteFolder(folderId));
  };

  const handleDragStart = (e, folder) => {
    setDraggedFolder(folder);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", folder.id);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedFolder) {
      const sourceIndex = folders.findIndex((f) => f.id === draggedFolder.id);
      dispatch(reorderFolders({ sourceIndex, targetIndex }));
      setDraggedFolder(null);
      setDragOverIndex(null);
    }
  };

  const handleSelectSpecialFolder = (folderType) => {
    dispatch(selectFolder(folderType));
    dispatch(selectFile(null));
  };

  const handleSelectFile = (fileId) => {
    dispatch(selectFile(fileId));
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 p-4">
      <h2 className="font-bold mb-4">Folders</h2>

      {/* Create new folder form */}
      <form onSubmit={handleCreateFolder} className="mb-4">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="border rounded p-1 mr-2"
        />
      </form>

      {/* Regular folders */}
      <ul>
        {folders.map((folder, index) => (
          <li
            key={folder.id}
            className={`mb-2 cursor-pointer hover:text-blue-500 flex justify-between items-center ${
              folder.id === selectedFolder ? "bg-blue-200 text-blue-800" : ""
            } ${dragOverIndex === index ? "border-t-2 border-blue-500" : ""}`}
            onClick={() => {
              dispatch(selectFolder(folder.id));
              dispatch(selectFile(null));
            }}
            draggable
            onDragStart={(e) => handleDragStart(e, folder)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <span className="flex items-center">
              <FaFolder className="mr-2" /> {folder.name}
            </span>
            <FaTrash
              className="text-red-500 hover:text-red-700 cursor-pointer"
              onClick={(e) => handleDeleteFolder(e, folder.id)}
            />
          </li>
        ))}
        {/* Drop zone for folders */}
        <li
          className={`h-8 ${
            dragOverIndex === folders.length ? "border-t-2 border-blue-500" : ""
          }`}
          onDragOver={(e) => handleDragOver(e, folders.length)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, folders.length)}
        ></li>
      </ul>

      {/* Special Folders */}
      <ul className="mb-4">
        <li
          className={`mb-2 cursor-pointer hover:text-blue-500 flex items-center ${
            selectedFolder === "favorites" ? "bg-blue-200 text-blue-800" : ""
          }`}
          onClick={() => handleSelectSpecialFolder("favorites")}
        >
          <FaStar className="mr-2 text-yellow-500" /> Favorites
        </li>
        <li
          className={`mb-2 cursor-pointer hover:text-blue-500 flex items-center ${
            selectedFolder === "archive" ? "bg-blue-200 text-blue-800" : ""
          }`}
          onClick={() => handleSelectSpecialFolder("archive")}
        >
          <FaArchive className="mr-2 text-gray-500" /> Archive
        </li>
      </ul>
    </div>
  );
}

export default LeftPanel;
