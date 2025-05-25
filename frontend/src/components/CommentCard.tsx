import React from 'react';
import { ThumbsUp, MessageSquare, Calendar } from 'lucide-react';

interface CommentCardProps {
  comment: {
    id: string;
  text: string;
  videoTitle: string;
  videoId: string;
  date: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  likes: number;
  replies: number;
  };
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const getSentimentColor = () => {
    switch (comment.sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSentimentText = () => {
    switch (comment.sentiment) {
      case 'positive':
        return 'Olumlu';
      case 'negative':
        return 'Olumsuz';
      default:
        return 'Nötr';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm font-medium ${getSentimentColor()}`}>
          {getSentimentText()}
          </span>
        <div className="flex items-center text-gray-500 text-sm">
          <Calendar className="w-4 h-4 mr-1" />
          {comment.date}
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{comment.text}</p>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {comment.videoTitle}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {comment.likes}
            </div>
            <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            {comment.replies}
          </div>
        </div>
      </div>
    </div>
  );
};