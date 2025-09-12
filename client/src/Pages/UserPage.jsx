import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../helper/ConfirmModel';
import { dateFormat } from '../components/DirectoryItem';


export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState("Guest User");
    const [userRole, setUserRole] = useState("User")

    //popup info
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });

    const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

    const navigate = useNavigate()

    useEffect(() => {
        fetchAllUsers()
        fetchUser()
    }, [])

    async function fetchAllUsers() {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            } else if (response.status === 403) {
                navigate("/")
            } else if (response.status === 401) {
                navigate("/login")
            } else {
                console.error("Error fetching user info : ", response.status)
            }
        } catch (error) {
            console.error("Error fetching user Info : ", error)
        }
    }

    async function fetchUser() {
        try {
            const response = await fetch(`${BASE_URL}/user`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setUserName(data.name);
                setUserEmail(data.email)
                setUserRole(data.role)
            } else if (response.status === 401) {
                navigate("/login")
            } else {
                // Handle other error statuses if needed
                console.error("Error fetching user info:", response.status);
            }
        } catch (err) {
            console.error("Error fetching user info:", err);
        }
    }

    const showConfirmationModal = (title, message, action) => {
        setModalTitle(title);
        setModalMessage(message);
        setOnConfirmAction(() => () => {
            action();
            setIsModalOpen(false);
        });
        setIsModalOpen(true);
    };


    const logoutUser = (user) => {
        const { id, email } = user;
        showConfirmationModal(
            "Confirm Logout",
            `Are you sure you want to logout ${email}?`,
            async () => {
                try {
                    const response = await fetch(`${BASE_URL}/users/${id}/logout`, {
                        method: "POST",
                        credentials: "include",
                    });
                    if (response.ok) {
                        console.log("Logged out successfully");
                        fetchAllUsers();
                    } else {
                        console.error("Logout failed");
                    }
                } catch (err) {
                    console.error("Logout error:", err);
                }
            }
        );
    };

    const deleteUser = (user) => {
        const { id, email } = user;
        showConfirmationModal(
            "Confirm Delete",
            `Are you sure you want to delete ${email}?`,
            async () => {
                try {
                    const response = await fetch(`${BASE_URL}/users/${id}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    if (response.ok) {
                        console.log("User Deleted Successfully");
                        fetchAllUsers();
                    } else {
                        console.error("Delete failed");
                    }
                } catch (err) {
                    console.error("Delete error:", err);
                }
            }
        );
    };


    return (
        <div className="users-container ">
            <h1 className="font-bold text-xl mb-4 text-slate-600 ">All users</h1>
            <p className='font-semibold mb-4 text-slate-600'> {userName} : <span className=' text-emerald-500 '>[{userRole}]</span></p>

            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-[#6A4BFF] text-white whitespace-nowrap">
                    <tr>
                        <th class="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Name
                        </th>
                        <th class="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Email
                        </th>
                        <th class="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Role
                        </th>
                        <th class="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Joined At
                        </th>
                        <th class="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Status
                        </th>
                        <th class="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">

                    {
                        users.map((user, index) => (
                            <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'} border border-slate-100 `}>
                                <td class="px-4 py-4 text-sm text-slate-900 font-medium">
                                    {user.username}
                                </td>
                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                    {user.email}
                                </td>
                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                    {user.role}
                                </td>
                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                    {dateFormat(user)}
                                </td>
                                <td class="px-4 py-4 text-sm text-slate-600 font-medium">
                                    {user.isLoggedIn ? <span className=' text-emerald-600 text-sm'>Logged In</span> : <span className='text-red-600 text-sm'>Logged Out</span>}
                                </td>
                                <td class="px-4 py-4 text-sm">
                                    <button class="logout-button px-2 py-1 cursor-pointer border border-blue-600 text-blue-600 font-medium mr-4 rounded-sm "
                                        onClick={() => logoutUser(user)}
                                        disabled={!user.isLoggedIn}
                                    >Logout</button>
                                    <button class="delete-button px-2 py-1 cursor-pointer border border-red-600 text-red-600 font-medium rounded-sm  "
                                        onClick={() => {
                                            deleteUser(user)
                                        }}
                                        disabled={userEmail === user.email}
                                    >Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {/* <table className="user-table">
                <thead className='bg-gray-50 whitespace-nowrap'>
                    <tr>
                        <th>
                            Name
                        </th>
                        <th >
                            Email
                        </th>
                        <th>
                            Status
                        </th>
                        <th></th>
                        {userRole === "Admin" && <th></th>}
                    </tr>
                </thead>
                <tbody className='text-gray-500'>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                {user.username}
                            </td>
                            <td>{user.email}</td>
                            <td>{user.isLoggedIn ? <span className='text-green-600 text-sm'>Logged In</span> : <span className='text-red-600 text-sm'>Logged Out</span>}</td>
                            <td>
                                <button
                                    className="logout-button"
                                    onClick={() => logoutUser(user)}
                                    disabled={!user.isLoggedIn}
                                >
                                    Logout
                                </button>
                            </td>
                            {
                                userRole === "Admin" &&
                                <td>
                                    <button
                                        className=" delete-button"
                                        onClick={() => {
                                            deleteUser(user)
                                        }}
                                        disabled={userEmail === user.email}
                                    >
                                        Delete
                                    </button>
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table> */}

            <ConfirmModal
                isOpen={isModalOpen}
                title={modalTitle}
                message={modalMessage}
                onConfirm={onConfirmAction}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
}
