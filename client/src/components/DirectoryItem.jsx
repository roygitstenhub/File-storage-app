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
import { formatSize } from "./DetailsPopup";
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useState } from "react";

export  const dateFormat = (item)=>{
   const date = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true,locale: {
          ...enUS,
          formatDistance: (token, count, options) => {
            // Get the default formatting
            const result = enUS.formatDistance(token, count, options);
            // Remove the word "about" if it exists
            return result.replace("about ", "");
          },
        }, })
    return date
  }

function DirectoryItem({ item, uploadProgress }) {
  const {
    handleRowClick,
    activeContextMenu,
    handleContextMenu,
    getFileIcon,
    isUploading,
  } = useDirectoryContext();


  // if (!item?.createdAt) return <Spinner/>;



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


// bg-gradient-to-l from-[#fff] to-[#6A4BFF]
  return (
     <div
      className="  bg-white flex flex-col justify-between p-4 hover:bg-indigo-100 border-gray-300 hover:border-indigo-500 rounded cursor-pointer relative shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)]   "
      onClick={() =>
        !(activeContextMenu || isUploading) &&
        handleRowClick(item.isDirectory ? "directory" : "file", item.id)
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      <div className="flex flex-col justify-between" title={`Size : ${formatSize(item.size)}\nCreated At : ${new Date(item.createdAt).toLocaleString()}`}>
        <div className="flex items-center w-full justify-between gap-2">
          {item.isDirectory ? (
            <span className="p-2 rounded-lg bg-blue-50  "><FaFolder className="text-amber-500 text-2xl" /></span>
       
          ) : (
            <span className="p-2 rounded-lg bg-blue-50 text-[#6A4BFF] text-2xl ">{renderFileIcon(getFileIcon(item.name))}</span>
          )}
        <div
          className=" text-black p-3 rounded-lg bg-blue-50 hover:text-gray-800 cursor-pointer hover:bg-indigo-200 "
          onClick={(e) => handleContextMenu(e, item.id)}
        >
          <BsThreeDotsVertical className="text-lg text-[#6A4BFF] " />
        </div>

        </div>

        <span className="font-semibold text-gray-600 truncate mt-3 text-sm  ">{item.name}</span>

        <div className=" mt-2 py-2 flex  justify-between border-gray-100">
            <span class="text-blue-600 text-[12px] font-semibold bg-blue-50 px-2 py-1 tracking-wide rounded-sm">
               { item.createdAt? dateFormat(item) : 'updating...'}
            </span>

            <span class="text-green-600 text-[12px]  font-semibold bg-green-50 px-2 py-1 tracking-wide rounded-sm">
                {formatSize(item.size)}
            </span>
        </div>

        {activeContextMenu === item.id && (
          <ContextMenu item={item} isUploadingItem={isUploadingItem} />
        )}
      </div>
      
      {isUploadingItem && (
        <div className="px-0 relative">
          <span
            className={`text-xs font-medium  ${uploadProgress > 50 ? "text-[#6A4BFF]" : "text-gray-600"} text-right block absolute left-1/2 top-[-20px] -translate-1/2 p-1.5 rounded-md `}
          >
            {Math.floor(uploadProgress)}%
          </span>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="h-2 rounded"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress > 50 ? "#00C950" : "#6A4BFF",
              }}
            ></div>
          </div>
        </div>
      )}
    </div> 
  );
}

{/* <div
      className=" bg-white flex flex-col justify-between  px-3 py-1 hover:bg-indigo-100  border-gray-300 hover:border-indigo-500 rounded cursor-pointer relative"
      onClick={() =>
        !(activeContextMenu || isUploading) &&
        handleRowClick(item.isDirectory ? "directory" : "file", item.id)
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      <div className="flex justify-between" title={`Size : ${formatSize(item.size)}\nCreated At : ${new Date(item.createdAt).toLocaleString()}`}>
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
    </div>  */}

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
  