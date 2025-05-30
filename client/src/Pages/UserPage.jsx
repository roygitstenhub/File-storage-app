import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState("Guest User");
    const [userRole, setUserRole] = useState("User")

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

    const logoutUser = async (user) => {
        const { id, email } = user
        const logoutConfirmed = confirm(`You are above to logout a ${email} `)
        if (!logoutConfirmed) return
        try {
            const response = await fetch(`${BASE_URL}/users/${id}/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                console.log("Logged out successfully");
                // Optionally reset local state
                fetchAllUsers()
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

        const deleteUser = async (user) => {
        const { id, email } = user
        const logoutConfirmed = confirm(`You are above to delete a ${email} `)
        if (!logoutConfirmed) return
        try {
            const response = await fetch(`${BASE_URL}/users/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                console.log("User Deleted Successfully");
                fetchAllUsers()
            } else {
                console.error("Delete failed");
            }
        } catch (err) {
            console.error("delete error:", err);
        }
    };

    return (
        <div className="users-container">
            <h1 className="title">All Users</h1>
            <p>{userName} : {userRole}</p>
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
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.isLoggedIn ? 'Logged In' : 'Logged Out'}</td>
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
        </div>
    );
}
