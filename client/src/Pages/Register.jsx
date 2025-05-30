import { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"
import { loginWithGoogle } from "../apis/loginWithGoogle.js";

const Register = () => {

    let _baseUrl = 'http://localhost:3030'

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [isError, setisError] = useState(false)
    const [isSuccess, setisSuccess] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        let newErrors = { username: "", email: "", password: "" };

        if (formData.username.trim().length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            valid = false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
            valid = false;
        }
        if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const _res = await fetch(`${_baseUrl}/user/register`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const _data = await _res.json()
            if (_data.error) {
                setisError(_data.error)
            } else {
                setisSuccess(true)
                navigate('/')
            }

        }
        setFormData({
            username: "",
            email: "",
            password: "",
        })
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700">Register</h2>
                <form className="mt-4" onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>
                    <p>{isError}</p>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className='w-full bg-blue-600  text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300'
                    >
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Sign In
                    </a>
                </p>

                <div className="or">
                    <span>Or</span>
                </div>

                <div className="google-login">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const data = await loginWithGoogle(credentialResponse.credential);
                            if (data.error) {
                                console.log(data);
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

export default Register;