import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 md:px-12 py-20 text-gray-400 text-sm">
      <div className="flex gap-6 mb-8 text-white">
        <Facebook className="w-6 h-6 cursor-pointer hover:opacity-80" />
        <Instagram className="w-6 h-6 cursor-pointer hover:opacity-80" />
        <Twitter className="w-6 h-6 cursor-pointer hover:opacity-80" />
        <Youtube className="w-6 h-6 cursor-pointer hover:opacity-80" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Audio Description</li>
          <li className="hover:underline cursor-pointer">Investor Relations</li>
          <li className="hover:underline cursor-pointer">Privacy</li>
          <li>
            <Link to="/about" className="hover:underline cursor-pointer">About & Creator</Link>
          </li>
          <li className="hover:underline cursor-pointer">Contact Us</li>
        </ul>
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Help Center</li>
          <li className="hover:underline cursor-pointer">Jobs</li>
          <li className="hover:underline cursor-pointer">Legal Notices</li>
          <li className="hover:underline cursor-pointer">Ad Choices</li>
        </ul>
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Gift Cards</li>
          <li className="hover:underline cursor-pointer">Netflix Shop</li>
          <li className="hover:underline cursor-pointer">Cookie Preferences</li>
          <li className="hover:underline cursor-pointer">Impressum</li>
        </ul>
        <ul className="space-y-3">
          <li className="hover:underline cursor-pointer">Media Center</li>
          <li className="hover:underline cursor-pointer">Terms of Use</li>
          <li className="hover:underline cursor-pointer">Corporate Information</li>
        </ul>
      </div>

      <div className="border border-gray-600 inline-block px-2 py-1 mb-6 hover:text-white cursor-pointer transition-colors">
        Service Code
      </div>

      <p className="text-xs">&copy; 2026-PRESENT VIOLETFLIX MOVIE, INC.</p>
    </footer>
  );
}
