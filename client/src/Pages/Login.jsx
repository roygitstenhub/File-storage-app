import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../apis/loginWithGoogle.js";
import { loginUser } from "../apis/UserApi.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      if (data.error) setServerError(data.error);
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err.response?.data?.error || "Something went wrong.");
    }
  };

  const hasError = Boolean(serverError);

  return (
    <div className="max-w-md mx-auto p-5  flex flex-col items-center justify-center w-full h-screen  ">
      {
        serverError && (
          <div class="flex items-start bg-red-100 text-red-800 p-4 rounded-lg relative" role="alert">
            <div class="inline-block">
              <span class="font-semibold text-[15px] inline-block mr-4">Error!</span>
              <span class="block text-sm font-medium sm:inline max-sm:mt-2 mr-4">{serverError}</span>
            </div>
          </div>
        )
      }
      <h2 className="text-center text-2xl font-semibold mb-3">Login</h2> 
      <form className="flex flex-col w-full  " onSubmit={handleSubmit}>

        <div className="mb-2">
          <label class="mb-2 text-sm text-slate-900 font-medium block">Email</label>
          <div class="relative flex items-center">
            <input id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 pr-8 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-gray-200 outline-[#6A4BFF] rounded-md transition-all" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
              viewBox="0 0 682.667 682.667">
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                </clipPath>
              </defs>
              <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                <path fill="none" stroke-miterlimit="10" stroke-width="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  data-original="#000000"></path>
                <path
                  d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  data-original="#000000"></path>
              </g>
            </svg>
          </div>
        </div>

        {/* <div className="relative mb-3">
          <label htmlFor="email" className="block mb-1 font-bold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border ${hasError ? "border-red-500" : "border-gray-300"} rounded`}
          />
        </div> */}

        <div className="mb-2">
          <label class="mb-2 text-sm text-slate-900 font-medium block">Password</label>
          <div class="relative flex items-center">
            <input id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-3 pr-8 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-gray-200 outline-[#6A4BFF] rounded-md transition-all" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
              class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"></path>
            </svg>
          </div>
        </div>

        {/* <div className="relative mb-3">
          <label htmlFor="password" className="block mb-1 font-bold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border ${hasError ? "border-red-500" : "border-gray-300"} rounded`}
          />
        </div> */}

        <button
          type="submit"
          className="bg-[#6A4BFF] text-white py-2 rounded w-full font-semibold tracking-widest hover:opacity-90 mt-2 "
        >
          Login
        </button>
      </form>

      <p className="text-center mt-3">
        Don't have an account?{" "}
        <Link className="text-[#6A4BFF] hover:underline" to="/register">
          Register
        </Link>
      </p>

      <div className="relative text-center my-3">
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-gray-300"></div>
        <span className="relative bg-white px-2 text-sm text-gray-600">Or</span>
      </div>

      <div className="flex justify-center  rounded-sm w-full ">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const data = await loginWithGoogle(credentialResponse.credential);
              if (!data.error) navigate("/");
            } catch (err) {
              console.error("Google login failed:", err);
            }
          }}
          onError={() => console.log("Login Failed")}
          theme="filled"
          text="continue_with"
          size="large"
          width=""
          useOneTap
        />
      </div>
    </div>
  );
};

export default Login;



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import { loginWithGoogle } from "../apis/loginWithGoogle.js";

// const Login = () => {
//     const _baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });

//     const [errors, setErrors] = useState({
//         email: "",
//         password: "",
//     });

//     const navigate = useNavigate();

//     const [isSuccess, setisSuccess] = useState(false)
//     const [isError, setisError] = useState(false)

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     };

//     const validateForm = () => {
//         let valid = true;
//         let newErrors = { email: "", password: "" };

//         if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = "Invalid email address";
//             valid = false;
//         }
//         if (formData.password.length < 6) {
//             newErrors.password = "Password must be at least 6 characters long";
//             valid = false;
//         }

//         setErrors(newErrors);
//         return valid;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             try {
//                 const _res = await fetch(`${_baseUrl}/user/login`, {
//                     method: "post",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify(formData),
//                     credentials: "include",
//                 })
//                 const _data = await _res.json()
//                 if (_data.error) {
//                     setisError(_data.error)
//                 } else {
//                     setisSuccess(true)
//                     navigate('/')

//                 }
//             } catch (error) {
//                 console.error("Error:", error);
//                 setServerError("Something went wrong. Please try again.");
//             }
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100">
//             <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
//                 {
//                     isError && (
//                         <div id="alert-border-2" class="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-100 dark:border-red-400" role="alert">
//                             <svg class="shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
//                             </svg>
//                             <div class="ms-3 text-sm font-medium">
//                                 {isError}<a href="#" class="font-semibold underline hover:no-underline"></a>
//                             </div>
//                         </div>
//                     )
//                 }
//                 <h2 className="text-2xl font-semibold text-center">Login</h2>
//                 <form className="mt-4" onSubmit={handleSubmit}>
//                     <div className="mt-4">
//                         <label className="block text-sm font-medium">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                         />
//                         {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//                     </div>
//                     <div className="mt-4">
//                         <label className="block text-sm font-medium">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
//                         />
//                         {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//                     </div>
//                     <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
//                         Login
//                     </button>
//                 </form>
//                 <p className="mt-4 text-center text-sm">
//                     Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a>
//                 </p>

//                 <div className="or">
//                     <span>Or</span>
//                 </div>

//                 <div className="google-login ">
//                     <GoogleLogin
//                         onSuccess={async (credentialResponse) => {
//                             const data = await loginWithGoogle(credentialResponse.credential);
//                             if (data.error) {
//                                  setisError(data.error)
//                                 return;
//                             }
//                             navigate("/");
//                         }}
//                         theme="filled_blue"
//                         text="continue_with"
//                         onError={() => {
//                             console.log("Login Failed");
//                         }}
//                         useOneTap
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
