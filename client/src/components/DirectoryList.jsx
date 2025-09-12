import { useDirectoryContext } from "../context/DirectoryContext";
import DirectoryItem from "./DirectoryItem";

function DirectoryList({ items }) {
  const { progressMap } = useDirectoryContext();

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
        {items.map((item) => {
          const uploadProgress = progressMap[item.id] || 0;
          return (
            <DirectoryItem
              key={item.id}
              item={item}
              uploadProgress={uploadProgress}
            />
          );
        })}
      </div>
  );
}

{/* <div className="space-y-2 ">
        {items.map((item) => {
          const uploadProgress = progressMap[item.id] || 0;
          return (
            <DirectoryItem
              key={item.id}
              item={item}
              uploadProgress={uploadProgress}
            />
          );
        })}
</div> */}

export default DirectoryList;

// import DirectoryItem from "./DirectoryItem";

// function DirectoryList({
//   items,
//   handleRowClick,
//   activeContextMenu,
//   contextMenuPos,
//   handleContextMenu,
//   getFileIcon,
//   isUploading,
//   progressMap,
//   handleCancelUpload,
//   handleDeleteFile,
//   handleDeleteDirectory,
//   openRenameModal,
//   BASE_URL,
// }) {
//   return (
//     <div className="directory-list">
//       {items.map((item) => {
//         const uploadProgress = progressMap[item.id] || 0;

//         return (
//           <DirectoryItem
//             key={item.id}
//             item={item}
//             handleRowClick={handleRowClick}
//             activeContextMenu={activeContextMenu}
//             contextMenuPos={contextMenuPos}
//             handleContextMenu={handleContextMenu}
//             getFileIcon={getFileIcon}
//             isUploading={isUploading}
//             uploadProgress={uploadProgress}
//             handleCancelUpload={handleCancelUpload}
//             handleDeleteFile={handleDeleteFile}
//             handleDeleteDirectory={handleDeleteDirectory}
//             openRenameModal={openRenameModal}
//             BASE_URL={BASE_URL}
//           />
//         );
//       })}
//     </div>
//   );
// }

// export default DirectoryList;
