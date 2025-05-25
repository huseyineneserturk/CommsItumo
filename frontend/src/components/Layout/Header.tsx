import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signInWithGoogle, logout } = useAuth();
  
  const navItems = [
    { name: 'Yorumlarım', path: '/my-comments' },
    { name: 'CSV Yükle', path: '/upload-csv' },
    { name: 'Kanal Analizi', path: '/youtube-analysis' },
    { name: 'Video Analizi', path: '/video-analysis' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center transform group-hover:scale-105">
              <img 
                src="/Resources/Logo.png" 
                alt="CommsItumo Logo" 
                className="w-10 h-10 object-contain filter brightness-0 invert"
                style={{
                  filter: 'brightness(0) invert(1)',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#FF0000] font-bold text-2xl leading-tight group-hover:text-red-700 transition-colors duration-300">
              CommsItumo
            </h1>
            <span className="text-xs text-gray-500 font-medium tracking-wide">
              Sentiment Analysis
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-[#FF0000] border-b-2 border-[#FF0000]'
                  : 'text-gray-700 hover:text-[#FF0000] hover:border-b-2 hover:border-[#FF0000]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-[#FF0000] transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">
                  {user.displayName || 'Profilim'}
                </span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-700 hover:text-[#FF0000] transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">Çıkış</span>
              </button>
            </>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center space-x-2 bg-[#FF0000] text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Giriş Yap</span>
          </button>
          )}

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#FF0000] transition-colors"
        >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-[#FF0000] bg-red-50'
                      : 'text-gray-700 hover:text-[#FF0000] hover:bg-red-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-2" />
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="text-sm font-medium py-2 px-3 rounded-lg text-gray-700 hover:text-[#FF0000] hover:bg-red-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profilim
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm font-medium py-2 px-3 rounded-lg text-gray-700 hover:text-[#FF0000] hover:bg-red-50 transition-colors text-left"
                  >
                    Çıkış Yap
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}