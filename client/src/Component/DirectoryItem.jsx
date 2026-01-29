import React from "react";
import {
  Folder,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  FileCode,
  File,
  Music,
} from "lucide-react";
import ContextMenu from "./ContextMenu.jsx";
import GridView from "./Views/GridView.jsx";
import ListView from "./Views/ListView.jsx";
import UploadToast from "./UploadToast.jsx";
import { useDirectoryContext } from "../context/DirectoryContext.js";

export default function DirectoryItem({ item }) {
  const {
    showInLines,
    handleRowClick,
    activeContextMenu,
    contextMenuPos,
    handleContextMenu,
    getFileIcon,
    handleCancelUpload,
    setDeleteItem,
    setShowDeleteModal,
    openRenameModal,
    openDetailsPopup,
    BASE_URL,
    uploadMap,
  } = useDirectoryContext();
  
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

  const isUploading = Object.values(uploadMap).some((item) => item.isUploading);

  const upload = uploadMap[item.id];
  return (
    <div
      className={
        showInLines
          ? ` hoverable-row relative flex flex-col gap-1 border  border-gray-300 rounded  bg-gray-50 cursor-pointer  hover:bg-gray-100  mx-6
          `
          : `
            relative w-full flex justify-center
          `
      }
      onClick={() => {
        if (!showInLines) return;
        if (activeContextMenu || isUploading) return;
        handleRowClick(item.isDirectory ? "directory" : "file", item.id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleContextMenu(e, item.id);
      }}
    >
      {showInLines ? (
        <ListView
          item={item}
          handleContextMenu={handleContextMenu}
          getFileIcon={getFileIcon}
          renderFileIcon={renderFileIcon}
        />
      ) : (
        <GridView
          item={item}
          handleRowClick={handleRowClick}
          handleContextMenu={handleContextMenu}
          activeContextMenu={activeContextMenu}
          isUploading={isUploading}
          getFileIcon={getFileIcon}
          renderFileIcon={renderFileIcon}
        />
      )}


      {upload && (
        <UploadToast
          fileName={item.name}
          progress={upload.progress}
          uploadedBytes={upload.uploadedBytes}
          totalBytes={upload.totalBytes}
          onCancel={() => handleCancelUpload(item.id)}
        />
      )}

      {/* Context menu */}
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
  );
}
