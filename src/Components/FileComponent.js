import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateFileContent, selectSelectedFile } from "../Redux/slices/folderSlice";

const FileComponent = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const selectedFile = useSelector(selectSelectedFile);

  useEffect(() => {
    if (selectedFile && contentRef.current) {
      contentRef.current.innerHTML = selectedFile.content || "";
      setCursorToEnd();
    }
  }, [selectedFile]);

  const handleInput = () => {
    if (selectedFile && contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      dispatch(updateFileContent({
        fileId: selectedFile.id,
        content: newContent
      }));
      setCursorToEnd();
    }
  };

  const setCursorToEnd = () => {
    if (contentRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      contentRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand("insertLineBreak");
      return false;
    }
  };

  return (
    <div
      ref={(el) => {
        contentRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className="border p-4 w-full h-full overflow-y-auto whitespace-pre-wrap"
    />
  );
});

export default FileComponent;
