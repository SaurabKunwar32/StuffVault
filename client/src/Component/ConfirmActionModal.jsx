import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";

export default function ConfirmActionModal({
  isOpen,
  type,
  user,
  onClose,
  onConfirm,
  onPermanentDelete,
}) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-fadeIn border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center">
          {type === "delete" ? (
            <div className="bg-red-100 rounded-full p-4 mb-4">
              <Trash2 className="w-10 h-10 text-red-600" />
            </div>
          ) : (
            <div className="bg-yellow-100 rounded-full p-4 mb-4">
              <LogOut className="w-10 h-10 text-yellow-600" />
            </div>
          )}

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {type === "delete" ? "Confirm Deletion" : "Confirm Logout"}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {type === "delete"
              ? `Are you sure you want to delete ${user?.name}? This action cannot be undone.`
              : `Do you really want to logout ${user?.name}?`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {type === "delete" ? (
            <>
              <button
                onClick={onConfirm}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md transition"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button
                onClick={onPermanentDelete}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-medium rounded-xl shadow-md transition"
              >
                <AlertTriangle className="w-4 h-4" /> Delete Permanently
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onConfirm}
                className="flex items-center justify-center gap-2 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl shadow-md transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
