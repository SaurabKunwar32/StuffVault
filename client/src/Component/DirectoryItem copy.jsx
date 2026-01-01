import React from 'react'
import { Folder, FileText, FileImage, FileVideo, FileArchive, FileCode, File, MoreVertical, Music, } from "lucide-react";
import ContextMenu from './ContextMenu.jsx'


export default function DirectoryItem({
  item,
  handleRowClick,
  activeContextMenu,
  contextMenuPos,
  handleContextMenu,
  getFileIcon,
  isUploading,
  uploadProgress,
  handleCancelUpload,
  openRenameModal,
  openDetailsPopup,
  setDeleteItem,
  setShowDeleteModal,
  showInLines,
  BASE_URL,
}) {

  // Convert the file icon string to the actual Icon component
  function renderFileIcon(iconString) {
    switch (iconString) {
      case "pdf":
        return <FileText className="text-red-500" />; // PDF-like appearance
      case "image":
        return <FileImage className="text-blue-500" />;
      case "video":
        return <FileVideo className="text-purple-500" />;
      case "archive":
        return <FileArchive className="text-yellow-500" />;
      case "code":
        return <FileCode className="text-green-500" />;
      case "audio":
      case "mp3":
        return <Music className="text-pink-500" />;
      case "folder":
        return <Folder className="text-yellow-600" />;
      case "text":
        return <FileText className="text-gray-600" />;
      case "alt":
      default:
        return <File className="text-gray-500" />;
    }
  }

  const isUploadingItem = item.id.startsWith("temp-");
  // console.log(isUploading);
  console.log(item);

  return (

    <div
      className="hoverable-row flex flex-col relative gap-1 border border-gray-300 rounded bg-gray-50 cursor-pointer hover:bg-gray-100 mx-6"
      onClick={() =>
        !(activeContextMenu || isUploading)
          ? handleRowClick(item.isDirectory ? "directory" : "file", item.id)
          : null
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >

      {showInLines ?
        <div className="item-left-container flex items-center gap-2">
          <div className=" item-left flex items-center gap-2 p-2.5 flex-grow">
            {item.isDirectory ? (
              <Folder
                className="text-orange-400"
                size={24}
                strokeWidth={2}
              />
            ) : (
              renderFileIcon(getFileIcon(item.name))
            )}
            <span>{item.name}</span>
          </div>

          {/* Three dots for context menu */}
          <div
            className="context-menu-trigger flex items-center justify-center text-xl cursor-pointer ml-auto text-gray-900 rounded-full p-2 mr-1 hover:bg-gray-300"
            onClick={(e) => handleContextMenu(e, item.id)}
          >
            <MoreVertical size={20} strokeWidth={2} />
          </div>
        </div>
         :
        <div className="relative w-56 rounded-xl border border-gray-200  bg-red-500 shadow-sm hover:shadow-md transition-shadow">
          {/* Menu button (top-right) */}
          <button
            onClick={(e) => handleContextMenu(e, item.id)}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 text-gray-600"
          >
            <MoreVertical size={18} strokeWidth={2} />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center justify-center p-6 gap-3">
            {item.isDirectory ? (
              <Folder className="text-orange-400" size={36} strokeWidth={2} />
            ) : (
              renderFileIcon(getFileIcon(item.name))
            )}

            <span className="text-sm font-medium text-gray-900 text-center truncate w-full">
              {item.name}
            </span>
          </div>
        </div>


      }



      {/* PROGRESS BAR: shown if an item is in queue or actively uploading */}
      {isUploadingItem && (
        <div className="progress-container bg-gray-600 rounded mt-1.5 mb-2 overflow-hidden relative mx-2.5">
          <span className="progress-value absolute text-xs left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
            {Math.floor(uploadProgress)}%
          </span>
          <div
            className="progress-bar bg-blue-600 rounded h-4"
            style={{
              width: `${uploadProgress}%`,
              backgroundColor: uploadProgress === 100 ? "#039203" : "#007bff",
            }}
          ></div>
        </div>
      )}

      {/* Context menu, if active */}
      {activeContextMenu === item.id && (
        <ContextMenu
          item={item}
          contextMenuPos={contextMenuPos}
          isUploadingItem={isUploadingItem}
          handleCancelUpload={handleCancelUpload}
          setDeleteItem={setDeleteItem}
          setShowDeleteModal={setShowDeleteModal}
          openRenameModal={openRenameModal}
          openDetailsPopup={openDetailsPopup}
          BASE_URL={BASE_URL}
        />
      )}
    </div>


  )
}
