import { Folder, MoreVertical } from "lucide-react";
import { formatSIze } from "../DetailsPopup";

const ListView = ({
  item,
  handleContextMenu,
  getFileIcon,
  renderFileIcon,
}) => {
  return (
    <div className="flex items-center gap-2" title={`Size: ${formatSIze(item.size)}\nCreated At: ${new Date(item.createdAt).toLocaleString()}`}>
      <div className="flex items-center gap-2 p-2.5 flex-grow">
        {item.isDirectory ? (
          <Folder className="text-orange-400" size={24} strokeWidth={2} />
        ) : (
          renderFileIcon(getFileIcon(item.name))
        )}

        <span className="truncate">{item.name}</span>
      </div>

      <button
        className="flex items-center justify-center p-2 mr-1 rounded-full hover:bg-gray-300"
        onClick={(e) => {
          e.stopPropagation();
          handleContextMenu(e, item.id);
        }}
      >
        <MoreVertical size={20} strokeWidth={2} />
      </button>
    </div>
  );
};

export default ListView;
