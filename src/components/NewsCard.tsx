import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Newspaper } from 'lucide-react';
import type { Article } from '../types';

interface NewsCardProps {
  article: Article;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const fallbackImageUrl = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop";
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-100">
        {article.imageUrl && !imageError ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full">
            <img
              src={fallbackImageUrl}
              alt="News article"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Newspaper className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600">{article.source}</span>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{article.category}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            Read more <ExternalLink className="ml-1 w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};