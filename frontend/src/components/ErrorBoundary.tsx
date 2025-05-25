import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hata:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Card className="w-full max-w-2xl">
            <Title level={4} className="text-center text-red-500 mb-4">
              Bir hata oluştu
            </Title>
            <Text type="secondary" className="block text-center mb-4">
              {this.state.error?.message || 'Beklenmeyen bir hata oluştu.'}
            </Text>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Sayfayı Yenile
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 