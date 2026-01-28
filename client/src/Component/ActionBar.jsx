import { Upload, Plus, Grid3X3, List } from "lucide-react";

export default function ActionBar({
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  SetShowInLines,
  disabled,
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* LEFT: FILE / FOLDER ACTIONS */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateFolderClick}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            New Folder
          </button>

          <button
            onClick={onUploadFilesClick}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            Upload
          </button>

          {/* Hidden input (unchanged behavior) */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFileSelect}
          />
        </div>

        {/* RIGHT: VIEW TOGGLE */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className="p-2 rounded-md hover:bg-gray-200"
            onClick={() => SetShowInLines(false)}
            title="Grid view"
          >
            <Grid3X3 size={18} />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-200"
            onClick={() => SetShowInLines(true)}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
