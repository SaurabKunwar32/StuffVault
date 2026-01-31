import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-6">
          Your subscription has been activated.
        </p>

        <button
          onClick={() => navigate("/app")}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition mb-3"
        >
          Go to App
        </button>

        <p className="text-sm text-gray-400">
          Redirecting you to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default Success;
