
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-textile-900 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">TextileFlow</h3>
            <p className="text-textile-300">
              Streamlining textile production processes with comprehensive tracking and management solutions.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/quality-control" className="text-textile-300 hover:text-white">Quality Control</a></li>
              <li><a href="/cutting-management" className="text-textile-300 hover:text-white">Cutting Management</a></li>
              <li><a href="/stitching-process" className="text-textile-300 hover:text-white">Stitching Process</a></li>
              <li><a href="/analytics" className="text-textile-300 hover:text-white">Analytics Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <p className="text-textile-300">Email: info@textileflow.com</p>
            <p className="text-textile-300">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="mt-8 border-t border-textile-700 pt-8 text-center">
          <p className="text-sm text-textile-400">© {new Date().getFullYear()} TextileFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
