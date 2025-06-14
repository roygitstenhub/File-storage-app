// DirectoryItem.js
import {
  FaFolder,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
  FaFileCode,
  FaFileAlt,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import ContextMenu from "./ContextMenu";
import { useDirectoryContext } from "../context/DirectoryContext";

function DirectoryItem({ item, uploadProgress }) {
  const {
    handleRowClick,
    activeContextMenu,
    handleContextMenu,
    getFileIcon,
    isUploading,
  } = useDirectoryContext();

  function renderFileIcon(iconString) {
    switch (iconString) {
      case "pdf":
        return <FaFilePdf />;
      case "image":
        return <FaFileImage />;
      case "video":
        return <FaFileVideo />;
      case "archive":
        return <FaFileArchive />;
      case "code":
        return <FaFileCode />;
      case "alt":
      default:
        return <FaFileAlt />;
    }
  }

  const isUploadingItem = item.id.startsWith("temp-");

  return (
    <div
      className="flex flex-col justify-between px-3 py-1 hover:bg-blue-100 border border-gray-300 hover:border-blue-500 rounded cursor-pointer relative"
      onClick={() =>
        !(activeContextMenu || isUploading) &&
        handleRowClick(item.isDirectory ? "directory" : "file", item.id)
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          {item.isDirectory ? (
            <FaFolder className="text-amber-500 text-lg" />
          ) : (
            renderFileIcon(getFileIcon(item.name))
          )}
          <span className="text-gray-800 truncate">{item.name}</span>
        </div>
        <div
          className="text-gray-600 hover:text-gray-800 cursor-pointer hover:bg-blue-200 p-2 rounded-full"
          onClick={(e) => handleContextMenu(e, item.id)}
        >
          <BsThreeDotsVertical />
        </div>
        {activeContextMenu === item.id && (
          <ContextMenu item={item} isUploadingItem={isUploadingItem} />
        )}
      </div>
      {isUploadingItem && (
        <div className="px-4 relative">
          <span
            className={`text-xs font-medium  ${uploadProgress > 50 ? "text-gray-200" : "text-gray-600"} text-right block absolute left-1/2 top-1/2 -translate-1/2`}
          >
            {Math.floor(uploadProgress)}%
          </span>
          <div className="w-full bg-gray-200 h-4 rounded">
            <div
              className="h-4 rounded"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress === 100 ? "#039203" : "#007bff",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectoryItem;


// import {
//     FaFolder,
//     FaFilePdf,
//     FaFileImage,
//     FaFileVideo,
//     FaFileArchive,
//     FaFileCode,
//     FaFileAlt,
//   } from "react-icons/fa";
//   import { BsThreeDotsVertical } from "react-icons/bs";
//   import ContextMenu from "../components/ContextMenu";
  
//   function DirectoryItem({
//     item,
//     handleRowClick,
//     activeContextMenu,
//     contextMenuPos,
//     handleContextMenu,
//     getFileIcon,
//     isUploading,
//     uploadProgress,
//     handleCancelUpload,
//     handleDeleteFile,
//     handleDeleteDirectory,
//     openRenameModal,
//     BASE_URL,
//   }) {
//     // Convert the file icon string to the actual Icon component
//     function renderFileIcon(iconString) {
//       switch (iconString) {
//         case "pdf":
//           return <FaFilePdf />;
//         case "image":
//           return <FaFileImage />;
//         case "video":
//           return <FaFileVideo />;
//         case "archive":
//           return <FaFileArchive />;
//         case "code":
//           return <FaFileCode />;
//         case "alt":
//         default:
//           return <FaFileAlt />;
//       }
//     }
  
//     const isUploadingItem = item.id.startsWith("temp-");
  
//     return (
//       <div
//         className="list-item hoverable-row"
//         onClick={() =>
//           !(activeContextMenu || isUploading)
//             ? handleRowClick(item.isDirectory ? "directory" : "file", item.id)
//             : null
//         }
//         onContextMenu={(e) => handleContextMenu(e, item.id)}
//       >
//         <div className="item-left-container">
//           <div className="item-left">
//             {item.isDirectory ? (
//               <FaFolder className="folder-icon" />
//             ) : (
//               renderFileIcon(getFileIcon(item.name))
//             )}
//             <span>{item.name}</span>
//           </div>
  
//           {/* Three dots for context menu */}
//           <div
//             className="context-menu-trigger"
//             onClick={(e) => handleContextMenu(e, item.id)}
//           >
//             <BsThreeDotsVertical />
//           </div>
//         </div>
  
//         {/* PROGRESS BAR: shown if an item is in queue or actively uploading */}
//         {isUploadingItem && (
//           <div className="progress-container">
//             <span className="progress-value">{Math.floor(uploadProgress)}%</span>
//             <div
//               className="progress-bar"
//               style={{
//                 width: `${uploadProgress}%`,
//                 backgroundColor: uploadProgress === 100 ? "#039203" : "#007bff",
//               }}
//             ></div>
//           </div>
//         )}
  
//         {/* Context menu, if active */}
//         {activeContextMenu === item.id && (
//           <ContextMenu
//             item={item}
//             contextMenuPos={contextMenuPos}
//             isUploadingItem={isUploadingItem}
//             handleCancelUpload={handleCancelUpload}
//             handleDeleteFile={handleDeleteFile}
//             handleDeleteDirectory={handleDeleteDirectory}
//             openRenameModal={openRenameModal}
//             BASE_URL={BASE_URL}
//           />
//         )}
//       </div>
//     );
//   }
  
//   export default DirectoryItem;
  