import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import trTR from 'antd/locale/tr_TR';
import 'dayjs/locale/tr';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { MyComments } from './pages/MyComments';
import { UploadCSV } from './pages/UploadCSV';
import { YouTubeAnalysis } from './pages/YouTubeAnalysis';
import VideoAnalysis from './pages/VideoAnalysis';
import { AuthProvider } from './lib/AuthContext';
import { AIProvider } from './contexts/AIContext';
import { YouTubeAuth } from './pages/YouTubeAuth';
import { Profile } from './pages/Profile';
import Callback from './pages/Callback';
import { CacheProvider } from './contexts/CacheContext';

export function App() {
  return (
    <ConfigProvider locale={trTR}>
      <AuthProvider>
        <CacheProvider>
          <AIProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/my-comments" element={<MyComments />} />
                  <Route path="/upload-csv" element={<UploadCSV />} />
                  <Route path="/youtube-analysis" element={<YouTubeAnalysis />} />
                  <Route path="/video-analysis" element={<VideoAnalysis />} />
                  <Route path="/youtube-auth" element={<YouTubeAuth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/callback" element={<Callback />} />
                </Routes>
              </Layout>
            </Router>
          </AIProvider>
        </CacheProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}