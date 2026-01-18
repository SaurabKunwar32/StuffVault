import { Folder, MoreVertical } from "lucide-react";
import { formatSIze } from "../DetailsPopup";

const GridView = ({
  item,
  handleRowClick,
  handleContextMenu,
  activeContextMenu,
  isUploading,
  getFileIcon,
  renderFileIcon,
}) => {
  return (
    <div
      className="
        relative
        w-full
        max-w-[14rem]
        rounded-xl
        border
        border-gray-200
        bg-white
        shadow-sm
        hover:shadow-md
        transition
        cursor-pointer
      "
      title={`Size: ${formatSIze(item.size)}\nCreated At: ${new Date(
        item.createdAt
      ).toLocaleString()}`}
      onClick={() => {
        if (activeContextMenu || isUploading) return;
        handleRowClick(item.isDirectory ? "directory" : "file", item.id);
      }}
    >
      {/* Card Content */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3">
        {item.isDirectory ? (
          <Folder className="text-orange-400" size={36} strokeWidth={2} />
        ) : (
          renderFileIcon(getFileIcon(item.name))
        )}

        <span
          className="
            text-sm
            font-medium
            text-gray-900
            text-center
            truncate
            w-full
            min-w-0
          "
        >
          {item.name}
        </span>
      </div>

      {/* Context Menu Button */}
      <button
        className="
          absolute
          top-2
          right-2
          p-2
          rounded-full
          hover:bg-gray-100
          text-gray-600
        "
        onClick={(e) => {
          e.stopPropagation();
          handleContextMenu(e, item.id);
        }}
      >
        <MoreVertical size={18} strokeWidth={2} />
      </button>
    </div>
  );
};

export default GridView;
