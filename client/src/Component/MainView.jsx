import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, CheckCircle2, AlertTriangle } from "lucide-react";

import Header from "./Header.jsx";
import DirectoryModel from "../Models/DirectoryModel.jsx";
import DirectoryList from "./DirectoryList.jsx";
import RenameModal from "../Models/RenameModal.jsx";
import DetailsPopup from "../Models/DetailsPopupModel.jsx";
import DeleteModal from "../Models/DeleteModel.jsx";
import { DirectoryContext } from "../context/DirectoryContext.js";

import {
  deleteFile,
  renameFile,
  uploadCancel,
  uploadComplete,
  uploadInitiate,
} from "../apis/fileApi.js";
import {
  getDirectoryItems,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from "../apis/directoryApi.js";
import Sidebar from "./Sidebar.jsx";
import ActionBar from "./ActionBar.jsx";
// import { fetchUser } from "../apis/userApi.js";

export default function MainView({ userData, loading, setUserData }) {
  const BASE_URL = "http://localhost:3000";

  const { dirId } = useParams();
  const navigate = useNavigate();

  //  Directory & Data State
  // const [directoryName, setDirectoryName] = useState("StuffVault");
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [breadCrumb, setBreadCrumb] = useState([]);

  //  UI State
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState("New Folder");

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null); // "directory" or "file"
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [renameErrorsMessage, setrenameErrorsMessage] = useState(null); // "directory" or "file"

  // Context menu
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showInLines, SetShowInLines] = useState(false);

  // Details and ui
  const [detailsItem, setDetailsItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  //  Upload State
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);
  const [uploadItem, setUploadItem] = useState(null);

  const openDetailsPopup = (item) => {
    setDetailsItem(item);
  };

  const closeDetailsPopup = () => setDetailsItem(null);

  //  Fetch directory contents
  const loadDirectory = async () => {
    try {
      const data = await getDirectoryItems(dirId);

      if (!data) return; // 401 silently ignored

      setBreadCrumb(data.breadCrumb);
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
    } catch (err) {
      setErrorMessage(
        err.response?.data?.error || err.response?.data || err.message,
      );
    }
  };

  useEffect(() => {
    if (loading) return; // wait for auth check
    if (!userData) return; // stop after logout

    loadDirectory();
    setActiveContextMenu(null);
  }, [dirId, userData, loading]);

  //   Decide file icon
  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "pdf";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return "image";
      case "mp4":
      case "mov":
      case "avi":
        return "video";
      case "zip":
      case "rar":
      case "tar":
      case "gz":
        return "archive";
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "html":
      case "css":
      case "py":
      case "java":
        return "code";
      case "mp3":
        return "audio";
      case "txt":
      case "md":
      case "log":
      case "csv":
        return "text";
      default:
        return "alt";
    }
  }

  // Navigation
  // Click row to open directory or file
  function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(`/directory/${id}`);
    } else {
      const fileUrl = `${BASE_URL}/file/${id}`;
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  }

  //   FILE UPLOAD (SINGLE FILE)

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadItem?.isUploading) {
      setErrorMessage("An upload is already in progress.");
      setTimeout(() => setErrorMessage(""), 2000);
      e.target.value = "";
      return;
    }

    const tempItem = {
      id: `temp-${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      isUploading: true,
    };

    try {
      const data = await uploadInitiate({
        name: file.name,
        size: file.size,
        contentType: file.type,
        parentDirId: dirId,
      });

      const { filId, uploadSignedUrl } = data;
      // console.log(data);

      // Optimistically show the file in the list
      setFilesList((prev) => [tempItem, ...prev]);
      setUploadItem(tempItem);
      e.target.value = "";

      startUpload({ item: tempItem, uploadUrl: uploadSignedUrl, filId });
    } catch (err) {
      if (err.status === 507 || 413) {
        setErrorMessage(err.response.data.error);
      }
      setTimeout(() => setErrorMessage(""), 2000);
      // console.log(err);
    }
  }

  function startUpload({ item, uploadUrl, filId }) {
    // console.log(uploadUrl);
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open("PUT", uploadUrl);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;

      setUploadItem((prev) =>
        prev
          ? {
              ...prev,
              progress: Math.round((evt.loaded / evt.total) * 100),
              uploadedBytes: evt.loaded,
              totalBytes: evt.total,
            }
          : prev,
      );
    };

    xhr.onload = async () => {
      // Clear upload state and refresh directory
      if (xhr.status === 200) {
        const fileUploadResponse = await uploadComplete(filId);
        setShowSuccessMessage(fileUploadResponse.message);
        setTimeout(() => setShowSuccessMessage(""), 2000);
        // console.log(fileUploadResponse.message);
      } else {
        setErrorMessage("File not uploded !!");
        setTimeout(() => setErrorMessage(""), 2000);
      }
      setUploadItem(null);
      loadDirectory();
    };

    xhr.onerror = () => {
      setErrorMessage("Something went wrong !!.");
      // Remove temp item from the list
      setFilesList((prev) => prev.filter((f) => f.id !== item.id));
      setUploadItem(null);
      setTimeout(() => setErrorMessage(""), 2000);
    };

    xhr.onabort = async () => {
      try {
        const res = await uploadCancel(filId); // NEW
        setErrorMessage(res.message);
        setTimeout(() => setErrorMessage(""), 2000);
      } catch (e) {
        console.log(e);
        // ignore — cleanup job will handle it
      }
      setUploadItem(null);
    };

    xhr.send(item.file);
  }

  function handleCancelUpload(tempId) {
    if (uploadItem?.id === tempId && xhrRef.current) {
      xhrRef.current.abort();
    }
    // Remove temp item and reset state
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setUploadItem(null);
  }

  // Delete a file /directory
  async function handleDeleteDirectory(id) {
    setErrorMessage("");
    try {
      const response = await deleteDirectory(id);
      setShowSuccessMessage(response.message);
      setTimeout(() => setShowSuccessMessage(""), 2000);
      // await handleFetchErrors(response);
      // console.log(response);
      loadDirectory();
    } catch (err) {
      setErrorMessage(
        err.message || "Something went wrong while deleting the file.",
      );
    }
  }

  async function handleDeleteFile(id) {
    setErrorMessage("");
    try {
      const response = await deleteFile(id);
      // console.log(response);
      setShowSuccessMessage(response.message);
      setTimeout(() => setShowSuccessMessage(""), 2000);
      // await handleFetchErrors(response);
      loadDirectory();
    } catch (err) {
      setErrorMessage(
        err.message || "Something went wrong while deleting the file.",
      );
    }
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();
    try {
      const response = await createDirectory(dirId, newDirname);
      setShowSuccessMessage(response.message);
      setTimeout(() => setShowSuccessMessage(""), 2000);
      // await handleFetchErrors(response);
      // console.log(response);
      setNewDirname("New Folder");
      setShowCreateDirModal(false);
      loadDirectory();
    } catch (err) {
      setTimeout(() => {
        setShowCreateDirModal(false);
      }, 1000);
      setErrorMessage(err.response?.data?.error || err.message);
    }
  }

  // Rename
  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }

  useEffect(() => {
    if (renameValue.trim().length > 0) {
      setrenameErrorsMessage("");
    }
  }, [renameValue]);

  // Rename file /directory
  async function handleRenameSubmit(e) {
    e.preventDefault();
    try {
      if (renameType === "file") {
        if (renameValue.length < 3 || !/^[^\s].*[^\s]$/i.test(renameValue)) {
          setrenameErrorsMessage(
            renameValue.length < 1
              ? "Value cannot be empty !!"
              : "Filename cannot start or end with a space !!",
          );
          return;
        }

        await renameFile(renameId, renameValue);
      } else {
        if (renameValue.length < 1 || !/^[^\s].*[^\s]$/.test(renameValue)) {
          setrenameErrorsMessage(
            renameValue.length < 1
              ? "Directory name cannot be empty !!"
              : "Directory name cannot start or end with a space !!",
          );
          return;
        }

        await renameDirectory(renameId, renameValue);
      }

      setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
      loadDirectory();
    } catch (err) {
      // console.log(err.response.data);
      const msg = err.response.data || "Rename failed";

      setErrorMessage(msg);

      setTimeout(() => {
        setShowRenameModal(false);
        setErrorMessage(msg);
      }, 1000);
    }
  }

  // Handle context menu
  function handleContextMenu(e, id) {
    e.stopPropagation();
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;
    // console.log(id);

    if (activeContextMenu === id) {
      setActiveContextMenu(null);
    } else {
      setActiveContextMenu(id);
      setContextMenuPos({ x: clickX - 110, y: clickY });
    }
  }

  useEffect(() => {
    function handleDocumentClick() {
      setActiveContextMenu(null);
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const CombinedItems = [
    ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
    ...filesList.map((d) => ({ ...d, isDirectory: false })),
  ];

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [errorMessage]);

  // For compatibility with children expecting these values:
  const uploadMap = uploadItem
    ? {
        [uploadItem.id]: {
          progress: uploadItem.progress,
          uploadedBytes: uploadItem.uploadedBytes,
          totalBytes: uploadItem.totalBytes,
          isUploading: uploadItem.isUploading,
        },
      }
    : {};


  return (
    <>
      {errorMessage &&
        errorMessage !==
          "Directory not found or you do not have access to it!" && (
          <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-lg min-w-[280px] max-w-sm">
              {/* Error Icon */}
              <AlertTriangle className="w-6 h-6 text-red-600" />

              {/* Message */}
              <div className="flex-1">
                <p>
                  {typeof errorMessage === "string"
                    ? errorMessage
                    : errorMessage?.message || "Something went wrong"}
                </p>
              </div>

              {/* Close Button (Centered) */}
              <button
                onClick={() => setErrorMessage("")}
                className="text-red-500 hover:text-red-700 transition ml-2"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      <div className="h-screen flex flex-col max-w-[1540px] mx-auto">

        <Header userData={userData} setUserData={setUserData} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar userData={userData} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <ActionBar
              onCreateFolderClick={() => setShowCreateDirModal(true)}
              onUploadFilesClick={() => fileInputRef.current.click()}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
              SetShowInLines={SetShowInLines}
              disabled={
                errorMessage ===
                "Directory not found or you do not have access to it!"
              }
            />
            {showSuccessMessage && (
              <div className="fixed top-6 right-6 z-50 animate-slide-in">
                <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border-l-4 border-green-600 rounded-lg shadow-lg min-w-[280px] max-w-sm">
                  {/* Success Icon */}
                  <CheckCircle2 className="w-6 h-6 text-green-600" />

                  {/* Message */}
                  <div className="flex-1">
                    <p className="text-sm text-green-800 font-medium leading-snug">
                      {showSuccessMessage}
                    </p>
                  </div>

                  {/* Close Button (Centered) */}
                  <button
                    onClick={() => setShowSuccessMessage("")}
                    className="text-green-600 hover:text-green-800 transition ml-2"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {showCreateDirModal && (
              <DirectoryModel
                newDirname={newDirname}
                setNewDirname={setNewDirname}
                onClose={() => setShowCreateDirModal(false)}
                onCreateDirectory={handleCreateDirectory}
              />
            )}

            {/* Rename Modal */}
            {showRenameModal && (
              <RenameModal
                renameType={renameType}
                renameValue={renameValue}
                setRenameValue={setRenameValue}
                onClose={() => setShowRenameModal(false)}
                onRenameSubmit={handleRenameSubmit}
                renameErrorsMessage={renameErrorsMessage}
              />
            )}

            {showDeleteModal && deleteItem && (
              <DeleteModal
                deleteType={deleteItem.isDirectory ? "directory" : "file"}
                deleteName={deleteItem.name}
                onClose={() => setShowDeleteModal(false)}
                onDelete={() => {
                  if (deleteItem.isDirectory) {
                    handleDeleteDirectory(deleteItem.id);
                  } else {
                    handleDeleteFile(deleteItem.id);
                  }
                  setShowDeleteModal(false);
                }}
              />
            )}

            {detailsItem && (
              <DetailsPopup item={detailsItem} onClose={closeDetailsPopup} />
            )}

            <DirectoryContext.Provider
              value={{
                items: CombinedItems,
                handleRowClick,
                errorMessage,
                activeContextMenu,
                contextMenuPos,
                handleContextMenu,
                getFileIcon,
                showInLines,
                uploadMap,
                handleCancelUpload,
                setDeleteItem,
                setShowDeleteModal,
                openRenameModal,
                openDetailsPopup,
                breadCrumb,
                BASE_URL,
              }}
            >
              <DirectoryList />
            </DirectoryContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}
