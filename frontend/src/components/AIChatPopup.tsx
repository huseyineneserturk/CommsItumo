import React, { useState } from 'react';
import { Modal, Input, Button, message, Spin, Avatar } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, CloseOutlined } from '@ant-design/icons';
import { getAuth } from 'firebase/auth';
import axios, { AxiosResponse } from 'axios';
import { useAI } from '../contexts/AIContext';

const { TextArea } = Input;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  date: string;
  language: string;
  video_title: string;
  sentiment: {
    polarity: number;
    subjectivity: number;
    confidence: number;
  };
}

interface ChatResponse {
  analysis: string;
  timestamp: string;
  error?: string;
}

export const AIChatPopup: React.FC = () => {
  const { comments } = useAI();
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Kullanıcı girişi gerekli');
      }
      
      const token = await user.getIdToken();
      
      const response: AxiosResponse<ChatResponse> = await axios.post('http://127.0.0.1:8000/api/gemini/analyze', {
        comments: comments.map((comment: Comment) => ({
          id: comment.id,
          text: comment.text,
          author: comment.author,
          date: comment.date,
          language: comment.language,
          video_title: comment.video_title,
          sentiment: comment.sentiment
        })),
        question: input
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.data.analysis,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      message.error('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setMessages([]);
    setInput('');
  };

  const handleOpen = () => {
    setIsVisible(true);
    // Hoş geldin mesajı ekle
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Merhaba! CommsItumo AI asistanınızım. Size nasıl yardımcı olabilirim? Yorumlar hakkında sorularınızı sorabilir, analiz sonuçlarını yorumlamamı isteyebilirsiniz.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <>
      {/* Custom Floating Button */}
      <div
        onClick={handleOpen}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: '80px',
          height: '80px',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="AI Asistanı"
      >
        <img 
          src="/Resources/Pop_Up_Logo.png" 
          alt="AI Chat" 
          style={{ 
            width: '70px', 
            height: '70px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.currentTarget.style.display = 'none';
            const fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = '🤖';
            fallbackDiv.style.fontSize = '40px';
            fallbackDiv.style.display = 'flex';
            fallbackDiv.style.alignItems = 'center';
            fallbackDiv.style.justifyContent = 'center';
            e.currentTarget.parentNode?.appendChild(fallbackDiv);
          }}
        />
             </div>

      {/* Chat Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-3">
            <img 
              src="/Resources/Pop_Up_Logo.png" 
              alt="AI Logo" 
              style={{ 
                width: '56px', 
                height: '56px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(255, 77, 79, 0.3))'
              }}
              onError={(e) => {
                // Fallback to a simple robot icon if image fails
                e.currentTarget.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.innerHTML = '🤖';
                fallbackDiv.style.fontSize = '32px';
                fallbackDiv.style.display = 'flex';
                fallbackDiv.style.alignItems = 'center';
                fallbackDiv.style.justifyContent = 'center';
                e.currentTarget.parentNode?.appendChild(fallbackDiv);
              }}
            />
            <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '18px' }}>CommsItumo AI Asistanı</span>
          </div>
        }
        open={isVisible}
        onCancel={handleClose}
        footer={null}
        width={600}
        style={{ top: 20 }}
        closeIcon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
      >
        <div className="flex flex-col h-[500px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 flex items-start ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.sender === 'ai' && (
                    <Avatar 
                      icon={<RobotOutlined />} 
                      style={{ backgroundColor: '#ff4d4f' }}
                    />
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-[#ff4d4f] text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar 
                      icon={<UserOutlined />} 
                      style={{ backgroundColor: '#ff4d4f' }}
                    />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center">
                <Spin size="large" style={{ color: '#ff4d4f' }} />
                <div className="mt-2 text-gray-500">AI düşünüyor...</div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <TextArea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              className="flex-1"
              style={{ borderRadius: '8px' }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              disabled={!input.trim()}
              style={{ 
                backgroundColor: '#ff4d4f',
                borderColor: '#ff4d4f',
                borderRadius: '8px'
              }}
            >
              Gönder
            </Button>
          </form>

          {/* Info Text */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            {comments.length > 0 
              ? `${comments.length} yorum verisi ile analiz yapılabilir`
              : 'Genel sorular sorabilirsiniz'
            }
          </div>
        </div>
      </Modal>
    </>
  );
}; 