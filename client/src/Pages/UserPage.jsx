import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../helper/ConfirmModel';


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

    const BASE_URL = "http://localhost:3030";

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
            <h1 className="title">All Users</h1>
            <p className='font-semibold mb-4 text-slate-600'> {userName} : ({userRole})</p>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th></th>
                        {userRole === "Admin" && <th></th>}
                    </tr>
                </thead>
                <tbody className='text-gray-500'>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
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
            </table>

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
