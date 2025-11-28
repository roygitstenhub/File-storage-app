import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUser, logoutUser, logoutAllSessions } from "../apis/UserApi.js";
import { searchFileAndFolders } from "../apis/fileApi.js";
import { Popover } from "@headlessui/react";

import {
  FaFolderPlus,
  FaUpload,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import DirectoryList from "./DirectoryList.jsx";

function DirectoryHeader({
  item,
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
  const [maxStorageInBytes, setmaxStorageInBytes] = useState(1073741824)
  const [usedStorageInBytes, setusedStorageInBytes] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [userId, setUserId] = useState(null)
  const [searchresult, setSearchresult] = useState([])
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const usedGB = usedStorageInBytes / 1024 ** 3
  const totalGB = maxStorageInBytes / 1024 ** 3

  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchUser();
        setUserId(data?.id)
        setUserName(data.name);
        setUserEmail(data.email);
        setUserPicture(data.picture)
        setmaxStorageInBytes(data.maxStorageInBytes)
        setusedStorageInBytes(data.usedStorageInBytes)
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


  async function handleSearchsubmit(e) {
    e.preventDefault()
    const data = await searchFileAndFolders(searchTerm, userId)
    setSearchresult(data)
    setSearchTerm("")
  }

  if (searchresult.length !== 0) {
    console.log(searchresult)
  }


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setShowDropdown(searchresult.length !== 0);
  }, [searchresult]);

  function handleFileClick(fileId) {
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${fileId}`
  }



  return (

    <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 gap-3">
      {
        item && (
          <nav className="flex space-x-2 text-sm w-full sm:w-auto justify-start sm:justify-start">
            <span className=" text-black font-semibold  ">My Drive:  </span>
            {item.map((dir, index) => (
              <div key={index} className="flex items-center">
                <span className={index === item.length - 1 ? 'font-semibold text-blue-500 ' : 'text-gray-500'}>
                  <a href={`/directory/${dir._id}`} className="">
                    {dir.name}
                  </a>
                </span>
                {index !== item.length - 1 && (
                  <span className="mx-1 text-gray-400 ">{'/'}</span>
                )}
              </div>
            ))}
          </nav>)
      }

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 ">
        
        <button
          className="text-white hover:text-white text-xl disabled:text-indigo-300 cursor-pointer
          fixed bottom-5 left-5 z-[99] bg-[#6A4BFF] hover:bg-indigo-700  px-5 py-3 rounded-full shadow-lg transition duration-300 hidden "
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

        <div class="bg-white flex px-1 py-1 rounded-md border border-indigo-500 overflow-hidden max-w-xl mx-auto  " ref={dropdownRef}>
          <input type='text'
            placeholder='Search Something...'
            className="w-full outline-none bg-white pl-4 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='button'
            class="bg-[#6A4BFF] hover:bg-indigo-700 transition-all text-white text-sm rounded-md px-5 py-2.5"
            onClick={handleSearchsubmit}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" fill="currentColor" className="text-white">
              <path
                d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
              </path>
            </svg>
          </button>

          {searchresult.length !== 0 && (
            showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-18 right-0 sm:right-2 w-full sm:w-[400px] z-20 mt-2 rounded-xl bg-white shadow-lg border border-gray-200 p-2 max-h-64 overflow-y-auto transition-all duration-200 ease-in-out"
          >
            {searchresult.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {searchresult.map((file) => (
                  <li
                    key={file._id}
                    className="p-3 hover:bg-indigo-50 rounded-lg cursor-pointer flex justify-between items-center transition-colors duration-150"
                    onClick={() => handleFileClick(file._id)}
                  >
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[70%] sm:max-w-[80%]">
                      <span className="text-[#6A4BFF]">{file.name}</span>
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {file.extension}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-sm text-gray-500 text-center">No results found</div>
            )}
          </div>

          )
          )}
        </div>

        <button
          className="text-white w-18  hover:text-white text-xl -mb-0.5 mr-0.5 disabled:text-indigo-300   cursor-pointer
           z-[99] bg-[#6A4BFF] hover:bg-indigo-700   px-6 py-3  rounded-md shadow-lg transition duration-300"
          title="Create Folder  "
          onClick={onCreateFolderClick}
          disabled={disabled}
        >
          <FaFolderPlus />
        </button>

        <div className="relative flex " ref={userMenuRef}>
          <button
            className="text-[#6A4BFF] hover:text-blue-700  "
            title="User Menu"
            onClick={handleUserIconClick}
          >
            {userPicture ? (
              <img
                className="w-12 h-12 rounded-full object-cover  "
                src={userPicture}
                alt={userName}
              />
            ) : (
              <FaUser />
            )}
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-10 mt-2 w-78 bg-white rounded-md shadow-md z-10 border border-gray-300 overflow-hidden">
              {loggedIn ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-800">
                    <div className="font-semibold">{userName}</div>
                    <div className="text-xs text-gray-500">{userEmail}</div>
                    <div className="flex flex-col text-xs mr-2 mt-2">
                      <div className="w-40 h-1 bg-gray-300 rounded-full overflow-hidden mb-1">
                        <div
                          className="bg-indigo-500 rounded-full h-full"
                          style={{ width: `${(usedGB / totalGB) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs">
                        {usedGB.toFixed(2)} GB of {totalGB} GB used
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200" />
                  <Link to='/plans'
                    className="flex items-center rounded-md text-white text-sm gap-2 bg-indigo-500 cursor-pointer m-1 hover:bg-indigo-400 px-4 py-2"
                  >
                    Get More Storage
                  </Link>
                  <div
                    className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-200 px-4 py-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-indigo-500" /> Logout
                  </div>
                  <div
                    className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-200 px-4 py-2"
                    onClick={handleLogoutAll}
                  >
                    <FaSignOutAlt className="text-indigo-500" /> Logout All
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
