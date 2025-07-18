import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-gray-200">
                  <img 
                    src="/Resources/Logo.png" 
                    alt="CommsItumo Logo" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-white">CommsItumo</h2>
                <span className="text-sm text-gray-300 font-medium">Sentiment Analysis Platform</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              YouTube yorum analiz aracı ile içeriklerinizi daha iyi anlayın. 
              Yapay zeka destekli duygu analizi ile izleyici kitlenizi derinlemesine inceleyin.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Türkiye'de geliştirildi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Hızlı Bağlantılar
            </h3>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/my-comments" 
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
              >
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Yorumlarım
              </Link>
              <Link 
                to="/upload-csv" 
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
              >
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                CSV Yükle
              </Link>
              <Link 
                to="/youtube-analysis" 
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
              >
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Kanal Analizi
              </Link>
              <Link 
                to="/video-analysis" 
                className="text-gray-300 hover:text-red-400 transition-colors duration-200 flex items-center group"
              >
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Video Analizi
              </Link>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              İletişim
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">Kütahya, Türkiye</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                <a 
                  href="mailto:huseyineneserturk@gmail.com" 
                  className="text-sm hover:text-red-400 transition-colors"
                >
                  huseyineneserturk@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm">+90 (551) 941 88 77</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400">Sosyal Medya</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/huseyineneserturk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="mailto:huseyineneserturk@gmail.com"
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} CommsItumo. Tüm hakları saklıdır.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-red-400 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link to="/terms" className="hover:text-red-400 transition-colors">
                Kullanım Şartları
              </Link>
              <Link to="/cookies" className="hover:text-red-400 transition-colors">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}