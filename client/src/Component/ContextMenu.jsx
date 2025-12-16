import { Pencil, Trash2, Download, XCircle, Info } from "lucide-react";

function ContextMenu({
  item,
  contextMenuPos,
  isUploadingItem,
  handleCancelUpload,
  setShowDeleteModal,
  setDeleteItem,
  openDetailsPopup,
  openRenameModal,
  BASE_URL,
}) {
  const menuStyle = { top: contextMenuPos.y, left: contextMenuPos.x };

  const menuClass =
    "fixed bg-white border border-gray-200 shadow-lg rounded-lg z-[999] py-2 w-52";

  const itemClass =
    "px-4 py-2 cursor-pointer whitespace-nowrap text-gray-700 font-medium hover:bg-blue-100 transition-colors duration-200 flex items-center gap-2";

  if (item.isDirectory) {
    return (
      <div className={menuClass} style={menuStyle}>
        <div
          className={itemClass}
          onClick={() => openRenameModal("directory", item.id, item.name)}
        >
          <Pencil size={18} className="text-blue-600" />
          Rename
        </div>
        <div
          className={itemClass}
          onClick={() => {
            setDeleteItem({ ...item, isDirectory: true });
            setShowDeleteModal(true);
          }}>
          <Trash2 size={18} className="text-red-600" />
          Delete
        </div>
        <div
          className={itemClass} onClick={() => openDetailsPopup(item)}
        >
          <Info size={18} className="text-gray-600" />
          Details
        </div>

      </div>
    );
  } else {
    if (isUploadingItem && item.isUploading) {
      // Shows only "cancle"
      return (
        <div className={menuClass} style={menuStyle}>
          <div
            className={itemClass}
            onClick={() => handleCancelUpload(item.id)}
          >
            <XCircle size={18} className="text-yellow-600" />
            Cancel
          </div>
        </div>
      );
    } else {
      return (
        <div className={menuClass} style={menuStyle}>
          <div
            className={itemClass}
            onClick={() =>
              (window.location.href = `${BASE_URL}/file/${item.id}?action=download`)
            }
          >
            <Download size={18} className="text-green-600" />
            Download
          </div>
          <div
            className={itemClass}
            onClick={() => openRenameModal("file", item.id, item.name)}
          >
            <Pencil size={18} className="text-blue-600" />
            Rename
          </div>
          <div className={itemClass}
            onClick={() => {
              setDeleteItem({ ...item, isDirectory: false });
              setShowDeleteModal(true);
            }}>
            <Trash2 size={18} className="text-red-600" />
            Delete
          </div>
          <div
            className={itemClass} onClick={() => openDetailsPopup(item)}
          >
            <Info size={18} className="text-gray-600" />
            Details
          </div>

        </div>
      );
    }
  }
}

export default ContextMenu;
