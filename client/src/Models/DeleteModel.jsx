import { Trash2 } from "lucide-react";

function DeleteModal({ onClose, onDelete, deleteType, deleteName }) {

  // useEffect(() => {
  //   // Close modal on Escape key
  //   const handleKeyDown = (e) => {
  //     if (e.key === "Escape") onClose();
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, [onClose]);

  // Prevent click bubbling
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 w-[90%] max-w-md rounded-xl shadow-xl transition-all duration-300 ease-in-out"
        onClick={handleContentClick}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-red-600" />
          Delete {deleteType === "file" ? "File" : "Folder"}
        </h2>

        <p className="text-gray-600 mb-2">
          Are you sure you want to delete
          <span className="font-semibold text-gray-900">
            {deleteName || "this item"}
          </span>
          ?
        </p>
        <p className="text-gray-600 mb-4"> This action cannot be undone !!</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onDelete}
            className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
