import DirectoryItem from './DirectoryItem'

export default function DirectoryList({
  items,
  handleRowClick,
  activeContextMenu,
  contextMenuPos,
  handleContextMenu,
  getFileIcon,
  isUploading,
  progressMap,
  handleCancelUpload,
  setDeleteItem,
  setShowDeleteModal,
  openRenameModal,
  showInLines,
  openDetailsPopup,
  uploadXhrMap,
  BASE_URL,
}) {

  // console.log(items);
  return (


    // <div className='flex flex-col gap-2.5 mt-5'>
    <div className={
      showInLines
        ? "flex flex-col gap-2.5 mt-5"
        : "grid grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4  px-10 mt-5"
    }>

      {
        items.map((item) => {
          const uploadProgress = progressMap[item.id] || 0;
          // console.log(uploadProgress);

          return (
            <DirectoryItem
              key={item.id}
              item={item}
              showInLines={showInLines}
              handleRowClick={handleRowClick}
              activeContextMenu={activeContextMenu}
              contextMenuPos={contextMenuPos}
              handleContextMenu={handleContextMenu}
              getFileIcon={getFileIcon}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              handleCancelUpload={handleCancelUpload}
              setDeleteItem={setDeleteItem}
              setShowDeleteModal={setShowDeleteModal}
              openRenameModal={openRenameModal}
              openDetailsPopup={openDetailsPopup}
              BASE_URL={BASE_URL}
              progressMap={progressMap}
              uploadXhrMap={uploadXhrMap}
            />
          )
        })
      }


    </div>
  )
}
