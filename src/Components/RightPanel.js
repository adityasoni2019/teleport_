import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FileComponent from "./FileComponent";
import { archiveFile, unarchiveFile, toggleFavorite, selectSelectedFile } from "../Redux/slices/folderSlice";
import { FaCog, FaArchive, FaStar, FaInbox } from "react-icons/fa";

function RightPanel() {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const selectedFile = useSelector(selectSelectedFile);
  const favoriteFiles = useSelector((state) => state.folders.favoriteFiles);
  const selectedFolder = useSelector((state) => state.folders.selectedFolder);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleArchive = () => {
    if (selectedFile) {
      dispatch(
        archiveFile({
          folderId: selectedFile.folderId,
          fileId: selectedFile.id,
        })
      );
    }
    setShowOptions(false);
  };

  const handleUnarchive = () => {
    if (selectedFile) {
      dispatch(unarchiveFile(selectedFile.id));
    }
    setShowOptions(false);
  };

  const handleToggleFavorite = () => {
    if (selectedFile) {
      dispatch(toggleFavorite(selectedFile.id));
    }
    setShowOptions(false);
  };

  const isFavorite = selectedFile
    ? favoriteFiles.some((f) => f.id === selectedFile.id)
    : false;

  return (
    <div className="flex flex-col w-full h-screen p-6 bg-white rounded-lg shadow-md">
      {selectedFile ? (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Editing: {selectedFile.name}
            </h2>
            <div className="relative">
              <FaCog
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    {selectedFolder !== 'archive' && (
                      <button
                        onClick={handleArchive}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FaArchive className="mr-2" /> Archive
                      </button>
                    )}
                    {selectedFolder === 'archive' && (
                      <button
                        onClick={handleUnarchive}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FaInbox className="mr-2" /> Unarchive
                      </button>
                    )}
                    <button
                      onClick={handleToggleFavorite}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FaStar className="mr-2" />{" "}
                      {isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mb-2 space-x-2">
            <button
              onClick={() => applyFormat("bold")}
              className="px-2 py-1 border rounded"
            >
              Bold
            </button>
            <button
              onClick={() => applyFormat("italic")}
              className="px-2 py-1 border rounded"
            >
              Italic
            </button>
            <button
              onClick={() => applyFormat("underline")}
              className="px-2 py-1 border rounded"
            >
              Underline
            </button>
            <button
              onClick={() => applyFormat("insertUnorderedList")}
              className="px-2 py-1 border rounded"
            >
              Bullet List
            </button>
            <select
              onChange={(e) => applyFormat("formatBlock", e.target.value)}
              className="px-2 py-1 border rounded"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </div>
          <div className="flex-grow overflow-hidden">
            <FileComponent ref={editorRef} />
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center">Select a file to edit</p>
      )}
    </div>
  );
}

export default RightPanel;
