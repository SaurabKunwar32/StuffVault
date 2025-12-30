import { useEffect, useRef, useState } from 'react';
import Header from './Header.jsx'
import { useNavigate, useParams } from 'react-router-dom';
import DirectoryModel from '../Models/DirectoryModel.jsx';
import DirectoryList from './DirectoryList.jsx';
import RenameModal from '../Models/RenameModal.jsx';
import DetailsPopup from './DetailsPopup.jsx'
import DeleteModal from '../Models/DeleteModel.jsx';
import { deleteFile, renameFile } from "../apis/fileApi.js";
import { getDirectoryItems, createDirectory, deleteDirectory, renameDirectory } from "../apis/directoryApi.js";


export default function DirectoryView() {

  const BASE_URL = "http://localhost:3000";
  const { dirId } = useParams();
  const navigate = useNavigate();

  // Displayed directory name
  const [directoryName, setDirectoryName] = useState("Storix");

  // Lists of items
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  // Modal states
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [newDirname, setNewDirname] = useState("New Folder");

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null); // "directory" or "file"
  const [renameErrorsMessage, setrenameErrorsMessage] = useState(null); // "directory" or "file"
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Uploading states
  const fileInputRef = useRef(null);
  const [uploadQueue, setUploadQueue] = useState([]); // queued items to upload
  const [uploadXhrMap, setUploadXhrMap] = useState({}); // track XHR per item
  const [progressMap, setProgressMap] = useState({}); // track progress per item
  const [isUploading, setIsUploading] = useState(false); // indicates if an upload is in progress

  // Context menu
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  // Details
  const [detailsItem, setDetailsItem] = useState(null);


  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);



  const openDetailsPopup = (item) => {
    console.log(item);
    setDetailsItem(item);
  };

  const closeDetailsPopup = () => setDetailsItem(null);



  // Utility: handle fetch errors
  // async function handleFetchErrors(response) {
  //   if (!response.ok) {
  //     let errMsg = `Request failed with status ${response.status}`;
  //     try {
  //       const data = await response.json()
  //       if (data.error) errMsg = data.error
  //     } catch (err) {
  //       // If JSON parsing fails, default errMsg stays
  //     }
  //     throw new Error(errMsg)
  //   }
  //   return response;
  // }

  async function handleFetchErrors(response) {
    // Axios doesn't have "ok", it throws errors for non-2xx responses automatically.
    // But in case the backend returns a custom error in data:
    if (!response || typeof response !== "object") {
      throw new Error("Some Error occured !! ");
    }

    if (response.error) {
      throw new Error(response.error);
    }

    // If you sometimes include status info manually in response
    if (response.status && response.status >= 400) {
      throw new Error(response.message || `Request failed with status ${response.status}`);
    }

    return response;
  }


  //  Fetch directory contents
  const loadDirectory = async () => {
    try {
      const data = await getDirectoryItems(dirId);
      setDirectoryName(dirId ? data.name : "My Drive");
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
    } catch (err) {
      // console.log(err.response.data);
      if (err.response?.status === 401) navigate("/login");
      else setErrorMessage(err.response.data || err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    loadDirectory();
    // Reset context menu
    setActiveContextMenu(null);
  }, [dirId]);

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


  // Click row to open directory or file
  function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(`/directory/${id}`)
    } else {
      window.location.href = `${BASE_URL}/file/${id}`
    }
  }

  // Select multiple files
  function handleFileSelect(e) {
    // console.log(e.target.files[0].name);
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newItems = selectedFiles.map((file) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;
      return {
        file,
        name: file.name,
        id: tempId,
        isUploading: false
      }
    });

    // Put them at the top of the existing list
    setFilesList((prev) => [...newItems, ...prev]);

    // Initialize progress=0 for each
    newItems.forEach((item) => {
      setProgressMap((prev) => ({ ...prev, [item.id]: 0 }));
    });

    // Add them to the uploadQueue
    setUploadQueue((prev) => [...prev, ...newItems]);

    // Clear file input so the same file can be chosen again if needed
    e.target.value = "";

    // Start uploading queue if not already uploading
    if (!isUploading) {
      setIsUploading(true);
      // begin the queue process
      processUploadQueue([...uploadQueue, ...newItems.reverse()]);
    }

  }


  // Upload items in queue one by one
  function processUploadQueue(queue) {
    if (queue.length === 0) {
      // No more items to upload
      setIsUploading(false)
      setUploadQueue([])
      setTimeout(() => {
        loadDirectory();
      }, 1000);
      return
    }

    // Take first item
    const [currentItem, ...restQueue] = queue

    // Mark it as uploading true
    setFilesList((prev) =>
      prev.map((f) =>
        f.id === currentItem.id ? { ...f, isUploading: true } : f
      )
    )


    // Start Upload 
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("filename", currentItem.name)

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setProgressMap((prev) => ({ ...prev, [currentItem.id]: progress }))
      }
    })

    xhr.addEventListener("load", () => {
      // Move on the next item
      processUploadQueue(restQueue)
    })

    // // If user cancels, remove from the queue
    setUploadXhrMap((prev) => ({
      ...prev, [currentItem.id]: xhr
    }))
    xhr.send(currentItem.file)

  }


  //  Cancel an in-progress upload
  function handleCancelUpload(tempId) {
    const xhr = uploadXhrMap[tempId];
    if (xhr) {
      xhr.abort();
    }

    // Remove it from queue if still there
    setUploadQueue((prev) => prev.filter((item) => item.id !== tempId));

    // Remove from filesList
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));

    // Remove from progressMap
    setProgressMap((prev) => {
      const { [tempId]: _, ...rest } = prev;
      return rest;
    });

    // Remove from Xhr map
    setUploadXhrMap((prev) => {
      const copy = { ...prev };
      delete copy[tempId];
      return copy;
    });
  }

  // Delete a file /directory
  async function handleDeleteDirectory(id) {
    setErrorMessage("")
    try {
      const response = await deleteDirectory(id)
      await handleFetchErrors(response);
      console.log(response);
      loadDirectory()
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong while deleting the file.")
    }
  }

  async function handleDeleteFile(id) {
    setErrorMessage("")
    try {
      const response = await deleteFile(id)
      // console.log(response);
      await handleFetchErrors(response);
      loadDirectory()
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong while deleting the file.")
    }
  }



  async function handleCreateDirectory(e) {
    e.preventDefault();
    try {
      const response = await createDirectory(dirId, newDirname);
      await handleFetchErrors(response);
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
    setRenameType(type)
    setRenameId(id)
    setRenameValue(currentName)
    setShowRenameModal(true)
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
              : "Filename cannot start or end with a space !!"
          );
          return;
        }

        await renameFile(renameId, renameValue);
      }
      else {
        if (renameValue.length < 1 || !/^[^\s].*[^\s]$/.test(renameValue)) {
          setrenameErrorsMessage(
            renameValue.length < 1
              ? "Directory name cannot be empty !!"
              : "Directory name cannot start or end with a space !!"
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
      const msg =
        err.response.data ||
        "Rename failed";

      setErrorMessage(msg);

      setTimeout(() => {
        setShowRenameModal(false);
        setErrorMessage(msg);
      }, 1000);
    }
  }


  // Handle context menu
  function handleContextMenu(e, id) {
    e.stopPropagation()
    e.preventDefault()
    const clickX = e.clientX;
    const clickY = e.clientY;

    if (activeContextMenu === id) {
      setActiveContextMenu(null)
    } else {
      setActiveContextMenu(id)
      setContextMenuPos({ x: clickX - 110, y: clickY })
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
    ...filesList.map((d) => ({ ...d, isDirectory: false }))
  ]


  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <>
      {errorMessage &&
        errorMessage !== "Directory not found or you do not have access to it!" && (
          <div className="fixed top-6 right-6 z-50 animate-slide-in">
            <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-lg min-w-[280px] max-w-sm">

              {/* Error Icon */}
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                  />
                </svg>
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium leading-snug">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}




      <Header
        directoryName={directoryName}
        onCreateFolderClick={() => setShowCreateDirModal(true)}
        onUploadFilesClick={() => fileInputRef.current.click()}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        // Disable if the user doesn't have access
        disabled={
          errorMessage ===
          "Directory not found or you do not have access to it!"
        } />


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
              // console.log(deleteItem);
              // return
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





      {
        CombinedItems.length === 0 ?
          (
            // Check if the error is specifically the "no access" error
            errorMessage ===
              "Directory not found or you do not have access to it!" ? (
              <p className="mt-6 text-center text-lg font-bold text-red-700">
                Directory not found or you do not have access to it!
              </p>
            ) : (
              <p className="mt-6 text-center text-lg font-bold text-gray-700">
                This folder is empty. Upload files or create a folder to see some data.
              </p>
            )
          )
          : (
            <DirectoryList
              items={CombinedItems}
              handleRowClick={handleRowClick}
              activeContextMenu={activeContextMenu}
              contextMenuPos={contextMenuPos}
              handleContextMenu={handleContextMenu}
              getFileIcon={getFileIcon}
              isUploading={isUploading}
              progressMap={progressMap}
              handleCancelUpload={handleCancelUpload}
              setDeleteItem={setDeleteItem}
              setShowDeleteModal={setShowDeleteModal}
              openRenameModal={openRenameModal}
              openDetailsPopup={openDetailsPopup}
              BASE_URL={BASE_URL}
            />
          )
      }
    </>
  )
}
