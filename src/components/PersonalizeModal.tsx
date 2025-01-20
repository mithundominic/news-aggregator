import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { NewsSource, Category, Author, Preferences } from "../types";

interface PersonalizeModalProps {
  onClose: () => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  onClose,
}) => {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const saved = localStorage.getItem("newsPreferences");
    return saved
      ? JSON.parse(saved)
      : {
          sources: [],
          categories: [],
          authors: [],
        };
  });

  const [availableSources, setAvailableSources] = useState<NewsSource[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const sources = localStorage.getItem("availableSources");
    const categories = localStorage.getItem("availableCategories");
    const authors = localStorage.getItem("availableAuthors");

    if (sources) setAvailableSources(JSON.parse(sources));
    if (categories) setAvailableCategories(JSON.parse(categories));
    if (authors) setAvailableAuthors(JSON.parse(authors));
  }, []);

  const handleSave = () => {
    localStorage.setItem("newsPreferences", JSON.stringify(preferences));
    onClose();
    window.location.reload();
  };

  const togglePreference = (type: keyof Preferences, id: string) => {
    setPreferences((prev: Preferences) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item) => item !== id)
        : [...prev[type], id],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Personalize Your News Feed
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Sources Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preferred Sources
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => togglePreference("sources", source.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      preferences.sources.includes(source.id)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {source.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preferred Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => togglePreference("categories", category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      preferences.categories.includes(category.id)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Authors Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preferred Authors
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableAuthors.map((author) => (
                  <button
                    key={author.id}
                    onClick={() => togglePreference("authors", author.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      preferences.authors.includes(author.id)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {author.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
