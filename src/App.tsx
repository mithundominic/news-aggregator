import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { Header } from "./components/Header";
import { Filters } from "./components/Filters";
import { NewsCard } from "./components/NewsCard";
import { fetchAllNews } from "./services/api";
import { useDebounce } from "./hooks/useDebounce";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import type { NewsSource, Category, Author, NewsFilters } from "./types";

function App() {
  // Load user preferences from localStorage
  const userPreferences = useMemo(() => {
    const saved = localStorage.getItem("newsPreferences");
    return saved ? JSON.parse(saved) : null;
  }, []);

  const [filters, setFilters] = useState<NewsFilters>({
    search: "",
    sources: userPreferences?.sources || [],
    categories: userPreferences?.categories || [],
    authors: userPreferences?.authors || [],
    dateFrom: "",
    dateTo: "",
  });

  const [initialSources, setInitialSources] = useState<NewsSource[]>([]);
  const [initialCategories, setInitialCategories] = useState<Category[]>([]);
  const [initialAuthors, setInitialAuthors] = useState<Author[]>([]);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(filters.search, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery(
    [
      "news",
      debouncedSearch,
      userPreferences,
      filters.dateFrom,
      filters.dateTo,
    ],
    async ({ pageParam = 1 }) => {
      const articles = await fetchAllNews(
        debouncedSearch,
        pageParam,
        filters.dateFrom || "",
        filters.dateTo || ""
      );
      return {
        articles,
        nextPage: articles.length > 0 ? pageParam + 1 : undefined,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  // Memoized and sorted articles with deduplication
  const allArticles = useMemo(() => {
    const seen = new Set();
    return (data?.pages.flatMap((page) => page.articles) ?? [])
      .filter((article) => {
        const duplicate = seen.has(article.id);
        seen.add(article.id);
        return !duplicate;
      })
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }, [data]);

  // Set initial filter options when first data is loaded
  useEffect(() => {
    if (allArticles.length > 0 && initialSources.length === 0) {
      const processFilterData = (
        items: Set<string>,
        prefix: string
      ): { id: string; name: string; enabled: boolean }[] => {
        return Array.from(items)
          .filter(Boolean)
          .slice(0, 15)
          .map((item) => ({
            id: item.toLowerCase().replace(/\s+/g, "-"),
            name: item,
            enabled: true,
            prefix,
          }));
      };

      // Process sources
      const uniqueSources = new Set(
        allArticles.map((article) => article.source).filter(Boolean)
      );
      const sources = processFilterData(uniqueSources, "source");
      setInitialSources(sources);
      localStorage.setItem("availableSources", JSON.stringify(sources));

      // Process categories
      const uniqueCategories = new Set(
        allArticles.map((article) => article.category).filter(Boolean)
      );
      const categories = processFilterData(uniqueCategories, "category");
      setInitialCategories(categories);
      localStorage.setItem("availableCategories", JSON.stringify(categories));

      // Process authors (filter out undefined)
      const uniqueAuthors = new Set(
        allArticles
          .map((article) => article.author)
          .filter((author): author is string => !!author)
      );
      const authors = processFilterData(uniqueAuthors, "author");
      setInitialAuthors(authors);
      localStorage.setItem("availableAuthors", JSON.stringify(authors));
    }
  }, [allArticles]);

  // Memoized filtered articles
  const filteredArticles = useMemo(() => {
    return allArticles?.filter((article) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText =
          `${article.title} ${article.description}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }

      // Source filter
      if (
        filters?.sources?.length > 0 &&
        !filters?.sources?.includes(
          article?.source?.toLowerCase()?.replace(/\s+/g, "-")
        )
      ) {
        return false;
      }

      // Category filter
      if (
        filters?.categories?.length > 0 &&
        !filters?.categories?.includes(
          article?.category?.toLowerCase()?.replace(/\s+/g, "-")
        )
      ) {
        return false;
      }

      // Author filter
      if (
        filters?.authors?.length > 0 &&
        (!article.author ||
          !filters?.authors?.includes(
            article?.author?.toLowerCase().replace(/\s+/g, "-")
          ))
      ) {
        return false;
      }

      // Date range filter
      const articleDate = new Date(article.publishedAt);
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate?.setHours(0, 0, 0, 0);
        if (articleDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (articleDate > toDate) return false;
      }

      return true;
    });
  }, [filters, allArticles]);

  const handleFiltersChange = useCallback((newFilters: NewsFilters) => {
    setFilters(newFilters);
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useIntersectionObserver(loadMoreRef, loadMore, {
    threshold: 0.5,
    rootMargin: "100px",
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="pt-16 flex flex-col lg:flex-row">
        <aside className="lg:w-80 lg:fixed lg:top-16 lg:bottom-0 lg:overflow-y-auto bg-white">
          <div className="p-6">
            <Filters
              filters={filters}
              sources={initialSources}
              categories={initialCategories}
              authors={initialAuthors}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </aside>

        <main className="flex-1 lg:ml-80 p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">
                Error loading articles. Please try again later.
              </p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No articles found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              {(hasNextPage || isFetchingNextPage) && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center items-center py-8"
                >
                  <div className="animate-pulse text-gray-500">
                    {isFetchingNextPage
                      ? "Loading more articles..."
                      : "Load more articles"}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
