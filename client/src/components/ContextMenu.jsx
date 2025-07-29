import { useDirectoryContext } from "../context/DirectoryContext";

function ContextMenu({ item, isUploadingItem }) {
  const {
    handleCancelUpload,
    setDeleteItem,
    openRenameModal,
    openDetailsPopup,
    BASE_URL,
  } = useDirectoryContext();

  const BAKEND_URL = import.meta.env.VITE_BACKEND_BASE_UR

  const menuClass =
    "absolute bg-white border border-blue-400 shadow-md rounded text-sm z-50 right-2 top-4/5 overflow-hidden";
  const itemClass = "px-4 py-2 hover:bg-blue-100 cursor-pointer";

  if (item.isDirectory) {
    return (
      <div className={menuClass}>
        <div
          className={itemClass}
          onClick={() => openRenameModal("directory", item.id, item.name)}
        >
          Rename
        </div>
        <div className={itemClass} onClick={() => setDeleteItem(item)}>
          Delete
        </div>
        <div className={itemClass} onClick={() => openDetailsPopup(item)}>
          Details
        </div>
      </div>
    );
  }

  if (isUploadingItem && item.isUploading) {
    return (
      <div className={menuClass}>
        <div className={itemClass} onClick={() => handleCancelUpload(item.id)}>
          Cancel
        </div>
      </div>
    );
  }

  return (
    <div className={menuClass}>
      <div
        className={itemClass}
        onClick={() =>{
           (window.location.href = `${BAKEND_URL}/file/${item.id}?action=download`)
        }}
      >
        Download
      </div>
      <div
        className={itemClass}
        onClick={() => openRenameModal("file", item.id, item.name)}
      >
        Rename
      </div>
      <div className={itemClass} onClick={() => setDeleteItem(item)}>
        Delete
      </div>
      <div className={itemClass} onClick={() => openDetailsPopup(item)}>
        Details
      </div>
    </div>
  );
}

export default ContextMenu;


// function ContextMenu({
//     item,
//     contextMenuPos,
//     isUploadingItem,
//     handleCancelUpload,
//     handleDeleteFile,
//     handleDeleteDirectory,
//     openRenameModal,
//     BASE_URL,
//   }) {
//     // Directory context menu
//     if (item.isDirectory) {
//       return (
//         <div
//           className="context-menu"
//           style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
//         >
//           <div
//             className="context-menu-item"
//             onClick={() => openRenameModal("directory", item.id, item.name)}
//           >
//             Rename
//           </div>
//           <div
//             className="context-menu-item"
//             onClick={() => handleDeleteDirectory(item.id)}
//           >
//             Delete
//           </div>
//         </div>
//       );
//     } else {
//       // File context menu
//       if (isUploadingItem && item.isUploading) {
//         // Only show "Cancel"
//         return (
//           <div
//             className="context-menu"
//             style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
//           >
//             <div
//               className="context-menu-item"
//               onClick={() => handleCancelUpload(item.id)}
//             >
//               Cancel
//             </div>
//           </div>
//         );
//       } else {
//         // Normal file
//         return (
//           <div
//             className="context-menu"
//             style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
//           >
//             <div
//               className="context-menu-item"
//               onClick={() =>
//                 (window.location.href = `${BASE_URL}/file/${item.id}?action=download`)
//               }
//             >
//               Download
//             </div>
//             <div
//               className="context-menu-item"
//               onClick={() => openRenameModal("file", item.id, item.name)}
//             >
//               Rename
//             </div>
//             <div
//               className="context-menu-item"
//               onClick={() => handleDeleteFile(item.id)}
//             >
//               Delete
//             </div>
//           </div>
//         );
//       }
//     }
//   }
  
//   export default ContextMenu;
  