import {
  Cloud,
  Home,
  Star,
  Share2,
  Trash2,
  HardDrive,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ userData }) {
  const [maxStorageInBytes, setMaxStorageInBytes] = useState(1073741824);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);

  const usedGB = usedStorageInBytes / 1024 ** 3;
  const totalGB = maxStorageInBytes / 1024 ** 3;
  const percentageUsed = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;
  const isOver80 = percentageUsed >= 80;

  useEffect(() => {
    if (!userData) return;
    setMaxStorageInBytes(userData.maxStorageInBytes);
    setUsedStorageInBytes(userData.usedStorageInBytes);
  }, [userData]);

  return (
    <aside className="w-64 bg-white border-r flex flex-col px-4 py-5">
      {/* Logo / Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
          <Cloud size={22} className="text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900 tracking-tight">
          StuffVault
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 text-sm">
        <NavItem icon={Home} label="Home" active />
        <NavItem icon={Star} label="Starred" />
        <NavItem icon={Share2} label="Shared" />
        <NavItem icon={Trash2} label="Bin" />
      </nav>

      {/* Storage Section */}
      <div className="mt-auto pt-6">
        <div className="rounded-xl border bg-gray-50 p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-800">
            <HardDrive size={16} />
            Storage usage
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOver80 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>

          {/* Usage text */}
          <div className="mt-2 flex justify-between text-xs text-gray-600">
            <span>{usedGB.toFixed(2)} GB used</span>
            <span>{totalGB.toFixed(2)} GB total</span>
          </div>
        </div>

        {/* Upgrade Button */}
        <Link
          to="/subplans"
          className="group mt-4 flex w-full items-center justify-center gap-2
             rounded-lg bg-black px-3 py-2
             text-xs font-semibold text-white
             transition-all duration-200
             hover:bg-gray-900 hover:shadow-md
             focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          <Sparkles size={14} className="opacity-80" />
          Upgrade Storage
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </aside>
  );
}

/* Reusable Nav Item */
function NavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition
        ${active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      <Icon size={16} />
      <span className="font-medium">{label}</span>
    </button>
  );
}
