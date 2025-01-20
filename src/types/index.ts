export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  source: string;
  category: string;
  author?: string;
  publishedAt: string;
}

export interface NewsSource {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Author {
  id: string;
  name: string;
  enabled: boolean;
}

export interface NewsFilters {
  search: string;
  sources: string[];
  categories: string[];
  authors: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

export interface ClearAllButtonProps {
  handleClear: () => void;
}
