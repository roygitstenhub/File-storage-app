import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const _baseUrl = "http://localhost:3030";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const [isSuccess, setisSuccess] = useState(false)
    const [isError, setisError] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { email: "", password: "" };

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email address";
            valid = false;
        }
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const _res = await fetch(`${_baseUrl}/user/login`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData),
                    credentials: "include",
                })
                const _data = await _res.json()
                if (_data.error) {
                    setisError(_data.error)
                } else {
                    setisSuccess(true)
                    setTimeout(() => {
                        navigate('/')
                    }, 1000)
                }
            } catch (error) {
                console.error("Error:", error);
                setServerError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                <p>{isError}</p>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
