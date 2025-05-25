import React, { useState, useEffect } from 'react';
import { Button, Card, message } from 'antd';
import youtubeService from '../services/youtubeService';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:5173/callback';
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
].join(' ');

export function YouTubeAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // URL'den auth code'u al
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      handleAuthCode(code);
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const handleAuthCode = async (code: string) => {
    try {
      // Token almak için backend'e istek at
      const response = await fetch('http://localhost:8000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Token alınamadı');
      }

      const { access_token, refresh_token } = await response.json();

      // YouTube kimlik doğrulaması
      await youtubeService.authenticateYouTube({ access_token, refresh_token });
      setIsAuthenticated(true);
      message.success('YouTube hesabınız başarıyla bağlandı!');

      // Auth code'u URL'den temizle
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Kimlik doğrulama hatası:', error);
      message.error('YouTube hesabı bağlanırken bir hata oluştu.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="YouTube Hesabı Bağla" style={{ maxWidth: 400, margin: '0 auto', marginTop: 50 }}>
        <p>
          {isAuthenticated
            ? 'YouTube hesabınız bağlı.'
            : 'YouTube hesabınızı bağlayarak kanal bilgilerinize ve yorumlarınıza erişebilirsiniz.'}
        </p>
        <Button
          type="primary"
          onClick={handleLogin}
          disabled={isAuthenticated}
          style={{ background: '#FF0000', borderColor: '#FF0000' }}
        >
          {isAuthenticated ? 'Bağlı' : 'YouTube ile Giriş Yap'}
        </Button>
      </Card>
    </div>
  );
} 