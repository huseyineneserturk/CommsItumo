import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
          throw new Error('Authorization code bulunamadı');
        }

        const response = await fetch(`http://localhost:8000/auth/google/callback?code=${code}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Google OAuth2 callback hatası');
        }

        // Başarılı kimlik doğrulama sonrası ana sayfaya yönlendir
        navigate('/');
      } catch (error) {
        console.error('Callback hatası:', error);
        if (error instanceof Error) {
          alert(`Hata: ${error.message}`);
        }
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Kimlik Doğrulama</h1>
        <p>Lütfen bekleyin...</p>
      </div>
    </div>
  );
};

export default Callback; 