
import React from "react";
import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-semibold text-textile-900">TextileFlow</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-textile-600 hover:text-textile-900">
              Home
            </Link>
            <Link to="/quality-control" className="px-3 py-2 text-sm font-medium text-textile-600 hover:text-textile-900">
              Quality Control
            </Link>
            <Link to="/cutting-management" className="px-3 py-2 text-sm font-medium text-textile-600 hover:text-textile-900">
              Cutting Management
            </Link>
            <Link to="/stitching-process" className="px-3 py-2 text-sm font-medium text-textile-600 hover:text-textile-900">
              Stitching Process
            </Link>
            <Link to="/analytics" className="px-3 py-2 text-sm font-medium text-textile-600 hover:text-textile-900">
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
