import { useEffect, useRef } from "react";

function RenameModal({
  renameType,
  renameValue,
  setRenameValue,
  onClose,
  onRenameSubmit,
  renameErrorsMessage
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus and select text only once on mount
    if (inputRef.current) {
      inputRef.current.focus();

      const dotIndex = renameValue.lastIndexOf(".");
      if (dotIndex > 0) {
        inputRef.current.setSelectionRange(0, dotIndex);
      } else {
        inputRef.current.select();
      }
    }

    // Listen for "Escape" key to close the modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup keydown event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Stop propagation when clicking inside the content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Close when clicking outside the modal content
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 w-[90%] max-w-md rounded-xl shadow-xl transition-all duration-300 ease-in-out"
        onClick={handleContentClick}
      >
        <h3 className="text-red-500 font-medium mt-2">
          {renameErrorsMessage}
        </h3>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Rename {renameType === "file" ? "File" : "Folder"}
        </h2>

        <form
          onSubmit={onRenameSubmit}
          className="flex flex-col gap-4"
        >
          <input
            ref={inputRef}
            type="text"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenameModal;
