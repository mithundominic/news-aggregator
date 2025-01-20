import React from "react";
import { Search, Calendar, X, XCircle } from "lucide-react";
import type { NewsSource, Category, Author, NewsFilters } from "../types";
import { ClearAll } from "./ClearAll";

interface FiltersProps {
  filters: NewsFilters;
  sources: NewsSource[];
  categories: Category[];
  authors: Author[];
  onFiltersChange: (filters: NewsFilters) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  sources,
  categories,
  authors,
  onFiltersChange,
}) => {
  const handleClear = (key: keyof NewsFilters) => {
    onFiltersChange({
      ...filters,
      [key]: Array.isArray(filters[key]) ? [] : "",
    });
  };

  const handleToggle = (key: keyof NewsFilters, id: string) => {
    const current = filters[key] as string[];
    onFiltersChange({
      ...filters,
      [key]: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const renderChips = (
    items: { id: string; name: string }[],
    selected: string[],
    key: keyof NewsFilters
  ) => (
    <div className="flex flex-wrap gap-2">
      {items.map(({ id, name }) => (
        <button
          key={id}
          onClick={() => handleToggle(key, id)}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected.includes(id)
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {name}
          {selected.includes(id) && <X className="w-3 h-3 ml-2" />}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Search</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
          {filters.search && (
            <button
              onClick={() => handleClear("search")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Date Range Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Date Range</h2>
        <div className="grid grid-cols-1 gap-4">
          {(["dateFrom", "dateTo"] as Array<keyof NewsFilters>).map((key) => (
            <div className="space-y-2" key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key === "dateFrom" ? "From" : "To"}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters[key]}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, [key]: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Sources</h2>
          {filters.sources.length > 0 && (
            <ClearAll handleClear={() => handleClear("sources")} />
          )}
        </div>
        {renderChips(sources, filters.sources, "sources")}
      </div>

      {/* Categories Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          {filters.categories.length > 0 && (
            <ClearAll handleClear={() => handleClear("categories")} />
          )}
        </div>
        {renderChips(categories, filters.categories, "categories")}
      </div>

      {/* Authors Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Authors</h2>
          {filters.authors.length > 0 && (
            <ClearAll handleClear={() => handleClear("authors")} />
          )}
        </div>
        {renderChips(authors, filters.authors, "authors")}
      </div>
    </div>
  );
};
