import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUser, logoutUser, logoutAllSessions } from "../apis/UserApi.js";
import {
  FaFolderPlus,
  FaUpload,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  disabled = false,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchUser();
        setUserName(data.name);
        setUserEmail(data.email);
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        setUserName("Guest User");
        setUserEmail("guest@example.com");
      }
    }
    loadUser();
  }, []);

  const handleUserIconClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      navigate("/login");
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    function handleDocumentClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  return (
    <header className="flex items-center justify-between border-b border-gray-300 py-2 mb-4">
      <h1 className="text-xl font-semibold">{directoryName}</h1>
      <div className="flex gap-4 items-end">
        <button
          className="text-blue-500 hover:text-blue-700 text-xl -mb-0.5 mr-0.5 disabled:text-blue-300 disabled:cursor-not-allowed"
          title="Create Folder"
          onClick={onCreateFolderClick}
          disabled={disabled}
        >
          <FaFolderPlus />
        </button>
        <button
          className="text-blue-500 hover:text-blue-700 text-xl disabled:text-blue-300 disabled:cursor-not-allowed"
          title="Upload Files"
          onClick={onUploadFilesClick}
          disabled={disabled}
        >
          <FaUpload />
        </button>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <div className="relative flex" ref={userMenuRef}>
          <button
            className="text-blue-500 hover:text-blue-700 text-xl"
            title="User Menu"
            onClick={handleUserIconClick}
          >
            {userPicture ? (
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={userPicture}
                alt={userName}
              />
            ) : (
              <FaUser />
            )}
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-4 mt-2 w-48 bg-white rounded-md shadow-md z-10 border border-gray-300 overflow-hidden">
              {loggedIn ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-800">
                    <div className="font-semibold">{userName}</div>
                    <div className="text-xs text-gray-500">{userEmail}</div>
                  </div>
                  <div className="border-t border-gray-200" />
                  <div
                    className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-200 px-4 py-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-blue-600" /> Logout
                  </div>
                  <div
                    className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-200 px-4 py-2"
                    onClick={handleLogoutAll}
                  >
                    <FaSignOutAlt className="text-blue-600" /> Logout All
                  </div>
                </>
              ) : (
                <div
                  className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-200 px-4 py-2"
                  onClick={() => {
                    navigate("/login");
                    setShowUserMenu(false);
                  }}
                >
                  <FaSignInAlt className="text-blue-600" /> Login
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DirectoryHeader;

// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaFolderPlus,
//   FaUpload,
//   FaUser,
//   FaSignOutAlt,
//   FaSignInAlt,
// } from "react-icons/fa";

// function DirectoryHeader({
//   directoryName,
//   onCreateFolderClick,
//   onUploadFilesClick,
//   fileInputRef,
//   handleFileSelect,
//   disabled = false,
// }) {
//   // Use a constant for the API base URL
//   const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("Guest User");
//   const [userEmail, setUserEmail] = useState("guest@example.com");

//   const userMenuRef = useRef(null);
//   const navigate = useNavigate();

//   // -------------------------------------------
//   // 1. Fetch user info from /user on mount
//   // -------------------------------------------
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const response = await fetch(`${BASE_URL}/user`, {
//           credentials: "include",
//         });
//         if (response.ok) {
//           const data = await response.json();
//           // Set user info if logged in
//           setUserName(data.name);
//           setUserEmail(data.email);
//           setLoggedIn(true);
//         } else if (response.status === 401) {
//           // User not logged in
//           setUserName("Guest User");
//           setUserEmail("guest@example.com");
//           setLoggedIn(false);
//         } else {
//           // Handle other error statuses if needed
//           console.error("Error fetching user info:", response.status);
//         }
//       } catch (err) {
//         console.error("Error fetching user info:", err);
//       }
//     }
//     fetchUser();
//   }, []);

//   // -------------------------------------------
//   // 2. Toggle user menu
//   // -------------------------------------------
//   const handleUserIconClick = () => {
//     setShowUserMenu((prev) => !prev);
//   };

//   // -------------------------------------------
//   // 3. Logout handler
//   // -------------------------------------------
//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/user/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//       if (response.ok) {
//         console.log("Logged out successfully");
//         // Optionally reset local state
//         setLoggedIn(false);
//         setUserName("Guest User");
//         setUserEmail("guest@example.com");
//         navigate("/login");
//       } else {
//         console.error("Logout failed");
//       }
//     } catch (err) {
//       console.error("Logout error:", err);
//     } finally {
//       setShowUserMenu(false);
//     }
//   };

//   const handleLogoutAll = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/user/logout-all`, {
//         method: "POST",
//         credentials: "include",
//       });
//       if (response.ok) {
//         console.log("Logged out successfully");
//         // Optionally reset local state
//         setLoggedIn(false);
//         setUserName("Guest User");
//         setUserEmail("guest@example.com");
//         navigate("/login");
//       } else {
//         console.error("Logout failed");
//       }
//     } catch (err) {
//       console.error("Logout error:", err);
//     } finally {
//       setShowUserMenu(false);
//     }
//   };


//   useEffect(() => {
//     function handleDocumentClick(e) {
//       if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
//         setShowUserMenu(false);
//       }
//     }
//     document.addEventListener("mousedown", handleDocumentClick);
//     return () => {
//       document.removeEventListener("mousedown", handleDocumentClick);
//     };
//   }, []);


//   return (
//     <header className="directory-header">
//       <h1>{directoryName}</h1>
//       <div className="header-links">
//         {/* Create Folder (icon button) */}
//         <button
//           className="icon-button"
//           title="Create Folder"
//           onClick={onCreateFolderClick}
//         >
//           <FaFolderPlus />
//         </button>

//         {/* Upload Files (icon button) - multiple files */}
//         <button
//           className="icon-button"
//           title="Upload Files"
//           onClick={onUploadFilesClick}
//         >
//           <FaUpload />
//         </button>
//         <input
//           ref={fileInputRef}
//           id="file-upload"
//           type="file"
//           style={{ display: "none" }}
//           multiple // Allows multiple file selection
//           onChange={handleFileSelect}
//         />


//         {/* User Icon & Dropdown Menu */}
//         <div className="user-menu-container" ref={userMenuRef}>
//           <button
//             className="icon-button"
//             title="User Menu"
//             onClick={handleUserIconClick}
//             disabled={disabled}
//           >
//             <FaUser />
//           </button>

//           {showUserMenu && (
//             <div className="user-menu">
//               {loggedIn ? (
//                 <>
//                   {/* Display name & email if logged in */}
//                   <div className="user-menu-item user-info">
//                     <span className="user-name">{userName}</span>
//                     <span className="user-email">{userEmail}</span>
//                   </div>
//                   <div className="user-menu-divider" />
//                   <div
//                     className="user-menu-item login-btn"
//                     onClick={handleLogout}
//                   >
//                     <FaSignOutAlt className="menu-item-icon" />
//                     <span>Logout</span>
//                   </div>

//                   <div
//                     className="user-menu-item login-btn"
//                     onClick={handleLogoutAll}
//                   >
//                     <FaSignOutAlt className="menu-item-icon" />
//                     <span>Logout All</span>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {/* Show Login if not logged in */}
//                   <div
//                     className="user-menu-item login-btn"
//                     onClick={() => {
//                       navigate("/login");
//                       setShowUserMenu(false);
//                     }}
//                   >
//                     <FaSignInAlt className="menu-item-icon" />
//                     <span>Login</span>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//     </header>
//   );
// }

// export default DirectoryHeader;
