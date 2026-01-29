import { ChevronRight, Home } from "lucide-react";
import DirectoryItem from "./DirectoryItem";
import { Link } from "react-router-dom";
import { useDirectoryContext } from "../context/DirectoryContext";

export default function DirectoryList() {
  const {
    items,
    errorMessage,
    showInLines,
    breadCrumb,
  } = useDirectoryContext();

  return (
    //  FULL HEIGHT LAYOUT
    <div className="flex flex-col h-screen bg-gray-50">

      {/* ===== Breadcrumb Bar (Sticky) ===== */}
      <div className="w-full bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-2.5 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {/* Home */}
          <Link
            to="/app"
            className="flex items-center gap-1.5 font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Home size={16} />
            <span>Home</span>
          </Link>

          {breadCrumb.map((item, index) => {
            const isLast = index === breadCrumb.length - 1;

            return (
              <div key={item._id} className="flex items-center gap-2">
                <ChevronRight size={14} className="text-gray-300" />

                {isLast ? (
                  <span
                    className="font-semibold text-gray-900 truncate max-w-[220px]"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    to={`/directory/${item._id}`}
                    className="font-medium text-gray-600 hover:text-blue-600 hover:underline transition truncate max-w-[220px]"
                    title={item.name}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">

        {items.length === 0 ? (
          errorMessage ===
          "Directory not found or you do not have access to it!" ? (
            <p className="mt-6 text-center text-lg font-bold text-red-700">
              Directory not found or you do not have access to it!
            </p>
          ) : (
            <p className="mt-6 text-center text-lg font-medium text-gray-400">
              This folder is empty. Upload files or create a folder to see some
              data.
            </p>
          )
        ) : (
          <div
            className={
              showInLines
                ? "flex flex-col gap-2.5 mt-5"
                : "grid mt-5 gap-6 grid-cols-[repeat(auto-fill,minmax(160px,1fr))]"
            }
          >
            {items.map((item) => (
              <DirectoryItem key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
