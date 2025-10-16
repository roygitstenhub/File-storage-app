import { Link } from 'react-router-dom';
import img from "../assets/not-found.png"
const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-white px-4">
            <img src={img} alt="" className=' lg:w-[500px] ' />

            <Link
                to="/"
                className="mt-6 text-blue-600 hover:underline font-medium"
            >
                Back to homepage
            </Link>
        </div>
    );
};

export default Error;