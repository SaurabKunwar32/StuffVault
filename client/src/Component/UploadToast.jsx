import { X } from "lucide-react";

const UploadToast = ({ fileName, progress, onCancel }) => {
    // console.log(fileName);
  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-lg bg-white border border-gray-200 shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-900 truncate">
          {fileName}
        </p>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {progress < 100 ? `Uploading… ${progress}%` : "Completed"}
      </p>
    </div>
  );
};

export default UploadToast;
