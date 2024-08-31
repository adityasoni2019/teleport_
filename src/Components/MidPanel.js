import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addFile,
  selectFile,
  deleteFile,
  reorderFiles,
} from "../Redux/slices/folderSlice";
import { FaTrash, FaStar, FaArchive } from "react-icons/fa";

function MidPanel() {
  const [newFileName, setNewFileName] = useState("");
  const [draggedFile, setDraggedFile] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const selectedFolder = useSelector((state) => state.folders.selectedFolder);
  const folders = useSelector((state) => state.folders.folders);
  const selectedFileId = useSelector((state) => state.folders.selectedFile);
  const dispatch = useDispatch();

  const selectedFolderFiles = selectedFolder
    ? folders.find((folder) => folder.id === selectedFolder)?.files || []
    : [];

  const favoriteFiles = useSelector((state) => state.folders.favoriteFiles);
  const archivedFiles = useSelector((state) => state.folders.archivedFiles);

  const getDisplayFiles = () => {
    if (selectedFolder === "favorites") return favoriteFiles;
    if (selectedFolder === "archive") return archivedFiles;
    return selectedFolderFiles;
  };

  const handleCreateFile = (e) => {
    e.preventDefault();
    if (newFileName.trim() !== "" && selectedFolder) {
      const newFile = { id: Date.now(), name: newFileName, content: "" };
      dispatch(addFile({ folderId: selectedFolder, file: newFile }));
      setNewFileName("");
    }
  };

  const handleDeleteFile = (e, fileId) => {
    e.stopPropagation();
    dispatch(deleteFile({ folderId: selectedFolder, fileId }));
  };

  const handleDragStart = (e, file) => {
    setDraggedFile(file);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", file.id);
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
    if (draggedFile) {
      const sourceIndex = selectedFolderFiles.findIndex(
        (f) => f.id === draggedFile.id
      );
      dispatch(
        reorderFiles({ folderId: selectedFolder, sourceIndex, targetIndex })
      );
      setDraggedFile(null);
      setDragOverIndex(null);
    }
  };

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 p-4">
      <h2 className="font-bold mb-4">Files</h2>
      {selectedFolder ? (
        <>
          {selectedFolder !== "favorites" && selectedFolder !== "archive" && (
            <form onSubmit={handleCreateFile} className="mb-4">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Create a new file" // apparently this is a better nudge
                className="border rounded p-1 mr-2"
              />
            </form>
          )}
          <ul>
            {getDisplayFiles().map((file, index) => (
              <li
                key={file.id}
                className={`mb-2 cursor-pointer hover:text-blue-500 flex justify-between items-center ${
                  file.id === selectedFileId ? "bg-blue-200 text-blue-800" : ""
                } ${
                  dragOverIndex === index ? "border-t-2 border-blue-500" : ""
                }`}
                onClick={() => {
                  console.log("on click of file");
                  console.log(selectedFolder);
                  console.log(file.id);
                  dispatch(selectFile(file.id));
                }}
                draggable={
                  selectedFolder !== "favorites" && selectedFolder !== "archive"
                }
                onDragStart={(e) => handleDragStart(e, file)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                <span className="flex items-center">
                  {selectedFolder === "favorites" && (
                    <FaStar className="mr-2 text-yellow-500" />
                  )}
                  {selectedFolder === "archive" && (
                    <FaArchive className="mr-2 text-gray-500" />
                  )}
                  {file.name}
                </span>
                {selectedFolder !== "favorites" &&
                  selectedFolder !== "archive" && (
                    <FaTrash
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={(e) => handleDeleteFile(e, file.id)}
                    />
                  )}
              </li>
            ))}
            {
              <li
                className={`h-8 ${
                  dragOverIndex === getDisplayFiles().length
                    ? "border-t-2 border-blue-500"
                    : ""
                }`}
                onDragOver={(e) => handleDragOver(e, getDisplayFiles().length)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, getDisplayFiles().length)}
              ></li>
            }
          </ul>
        </>
      ) : (
        <p>Select a folder to view files</p>
      )}
    </div>
  );
}

export default MidPanel;
