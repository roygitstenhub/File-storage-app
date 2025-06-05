import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../apis/loginWithGoogle.js";

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
                    navigate('/')

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
                {
                    isError && (
                        <div id="alert-border-2" class="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-100 dark:border-red-400" role="alert">
                            <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <div class="ms-3 text-sm font-medium">
                                {isError}<a href="#" class="font-semibold underline hover:no-underline"></a>
                            </div>
                        </div>
                    )
                }
                <h2 className="text-2xl font-semibold text-center">Login</h2>
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

                <div className="or">
                    <span>Or</span>
                </div>

                <div className="google-login ">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const data = await loginWithGoogle(credentialResponse.credential);
                            if (data.error) {
                                 setisError(data.error)
                                return;
                            }
                            navigate("/");
                        }}
                        theme="filled_blue"
                        text="continue_with"
                        onError={() => {
                            console.log("Login Failed");
                        }}
                        useOneTap
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
