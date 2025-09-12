import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../apis/loginWithGoogle.js";
import { registerUser } from "../apis/UserApi.js";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  //   const [otp, setOtp] = useState("");
  //   const [otpSent, setOtpSent] = useState(false);
  //   const [otpVerified, setOtpVerified] = useState(false);
  //   const [otpError, setOtpError] = useState("");
  //   const [isSending, setIsSending] = useState(false);
  //   const [isVerifying, setIsVerifying] = useState(false);
  //   const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (countdown > 0) {
  //       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if (name === "email") {
    //   setServerError("");
    //   setOtpError("");
    //   setOtpSent(false);
    //   setOtpVerified(false);
    // //   setCountdown(0);
    // }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handleSendOtp = async () => {
  //     if (!formData.email) return setOtpError("Please enter your email first.");
  //     try {
  //       setIsSending(true);
  //       await sendOtp(formData.email);
  //       setOtpSent(true);
  //       setCountdown(60);
  //       setOtpError("");
  //     } catch (err) {
  //       setOtpError(err.response?.data?.error || "Failed to send OTP.");
  //     } finally {
  //       setIsSending(false);
  //     }
  //   };

  //   const handleVerifyOtp = async () => {
  //     if (!otp) return setOtpError("Please enter OTP.");
  //     try {
  //       setIsVerifying(true);
  //       await verifyOtp(formData.email, otp);
  //       setOtpVerified(true);
  //       setOtpError("");
  //     } catch (err) {
  //       setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
  //     } finally {
  //       setIsVerifying(false);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!otpVerified) return setOtpError("Please verify your email with OTP.");
    try {
      console.log(formData)
      await registerUser({ ...formData });
      setIsSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 flex flex-col items-center justify-center w-full h-screen">
      <h2 className="text-center text-2xl font-semibold mb-3">Register</h2>
      <form className="flex flex-col w-full " onSubmit={handleSubmit}>

        <div className="mb-2">
          <label class="mb-2 text-sm text-slate-900 font-medium block">First Name</label>
          <div class="relative flex items-center">
            <input type="text"
              placeholder="UserName"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="px-4 py-3 pr-8 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-gray-200 outline-[#007bff] rounded-md transition-all" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
              viewBox="0 0 24 24">
              <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
              <path
                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                data-original="#000000"></path>
            </svg>
          </div>
        </div>

        {/* <div className="relative mb-3">
          <label className="block mb-1 font-bold">Name</label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div> */}


        <div className="mb-2">
          <label class="mb-2 text-sm text-slate-900 font-medium block">Email</label>
          <div class="relative flex items-center">
            <input type="email"
              placeholder="Email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 pr-8 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-gray-200 outline-[#007bff] rounded-md transition-all" />
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
          <label className="block mb-1 font-bold">Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 pr-24 border ${serverError ? "border-red-500" : "border-gray-300"} rounded`}
            /> */}
        {/* <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSending || countdown > 0}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 text-xs rounded"
            >
              {isSending
                ? "Sending..."
                : countdown > 0
                  ? `${countdown}s`
                  : "Send OTP"}
            </button> */}
        {/* </div> */}

        {/* /* {serverError && (
            <span className="absolute text-xs text-red-500 mt-1">
              {serverError}
            </span>
          )}
        </div> */ }

        {/* {otpSent && (
          <div className="relative mb-3">
            <label className="block mb-1 font-bold">Enter OTP</label>
            <div className="relative">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 pr-24 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpVerified}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 text-xs rounded"
              >
                {isVerifying
                  ? "Verifying..."
                  : otpVerified
                    ? "Verified"
                    : "Verify OTP"}
              </button>
            </div>
            {otpError && (
              <span className="absolute text-xs text-red-500 mt-1">
                {otpError}
              </span>
            )}
          </div>

        )} */}

        <div className="mb-2">
          <label class="mb-2 text-sm text-slate-900 font-medium block">Password</label>
          <div class="relative flex items-center">
            <input type="password"
              placeholder="Password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-3 pr-8 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-gray-200 outline-[#007bff] rounded-md transition-all" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
              class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"></path>
            </svg>
          </div>
        </div>

        {/* <div className="relative mb-3">
          <label className="block mb-1 font-bold">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div> */}

        <button
          type="submit"
          className={`bg-[#6A4BFF] text-white py-2 rounded w-full font-semibold hover:opacity-90 mt-2 `}
        >
          {isSuccess ? "Registration Successful" : "Register"}
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account?{" "}
        <Link to="/login" className="text-[#6A4BFF] hover:underline">
          Login
        </Link>
      </p>

      <div className="relative text-center my-3">
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-[2px] bg-gray-300"></div>
        <span className="relative bg-white px-2 text-sm text-gray-600">Or</span>
      </div>

      <div className="flex justify-center  w-full rounded-sm ">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const data = await loginWithGoogle(credentialResponse.credential);
            if (!data.error) navigate("/");
          }}
          onError={() => console.log("Login Failed")}
          theme=""
          text="continue_with"
          useOneTap
        />
      </div>
    </div>
  );
};

export default Register;
