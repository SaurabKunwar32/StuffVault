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
  openDetailsPopup,
  BASE_URL,
}) {
  return (

    <div className='flex flex-col gap-2.5 mt-5'>

      {
        items.map((item) => {
          const uploadProgress = progressMap[item.id] || 0;

          return (
            <DirectoryItem
              key={item.id}
              item={item}
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

            />
          )
        })
      }


    </div>
  )
}
