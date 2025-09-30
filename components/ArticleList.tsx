import React from 'react';
import { Article } from '../types';

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-md mt-8">
        <h3 className="text-xl font-semibold text-gray-700">No Articles Found</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          We couldn't find any articles for your search. Please try a different query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mt-8 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Relevant Resources</h2>
      <ul className="space-y-4">
        {articles.map((article, index) => (
          <li key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <h3 className="text-lg font-semibold text-blue-700 group-hover:underline">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 truncate group-hover:text-blue-600">
                {article.url}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
