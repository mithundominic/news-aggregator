import React, { useState } from "react";
import { Newspaper, UserCog } from "lucide-react";
import { PersonalizeModal } from "./PersonalizeModal";

export const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                News Aggregator
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Personalize"
            >
              <UserCog className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {isModalOpen && (
        <PersonalizeModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};
