import { Link } from "react-router-dom";

export default function InvalidRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-red-600 mb-4">404</h1>

        <p className="text-red-600 text-lg mb-8">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/app"
          className="inline-block px-6 py-3 rounded-lg bg-green-900 text-white text-sm font-medium
                     hover:bg-green-800 transition-colors duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
