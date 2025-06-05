import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center bg-white px-4">
            <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mb-6">
                <span className="text-5xl text-gray-400">404</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-600 mt-2">OOPS! PAGE NOT BE FOUND</h2>
            <p className="text-gray-500 mt-4 max-w-md">
                Sorry but the page you are looking for does not exist, has been removed,
                name changed or is temporarily unavailable.
            </p>

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