import { X } from "lucide-react";

const UploadToast = ({
  fileName,
  progress,
  onCancel,
  totalBytes,
  uploadedBytes,
}) => {
  // console.log(fileName);
  // console.log({ progress });
  function formatBytes(bytes, decimals = 2) {
    if (!bytes || bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${
      sizes[i]
    }`;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 rounded-xl bg-white border shadow-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {fileName}
        </p>

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>
          {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
        </span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

export default UploadToast;
