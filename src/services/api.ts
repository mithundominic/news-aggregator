import axios from "axios";
import type { Article } from "../types";

const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const guardianApi = axios.create({
  baseURL: "https://content.guardianapis.com",
});

const nytApi = axios.create({
  baseURL: "https://api.nytimes.com/svc/search/v2",
});

const newsApi = axios.create({
  baseURL: "https://newsapi.org/v2",
});

export const fetchGuardianNews = async (
  query: string,
  page: number,
  dateFrom: string,
  dateTo: string
): Promise<Article[]> => {
  try {
    const response = await guardianApi.get("/search", {
      params: {
        "api-key": GUARDIAN_API_KEY,
        q: query || "latest",
        "order-by": "newest",
        "show-fields": "headline,thumbnail,byline,bodyText",
        "page-size": 10,
        page,
        dateFrom,
        dateTo,
      },
    });

    return response.data.response.results.map((article: any) => ({
      id: Math.random().toString(36).substring(7),
      title: article.webTitle,
      description: article.fields.bodyText.substring(0, 200) + "...",
      url: article.webUrl,
      imageUrl: article.fields.thumbnail,
      source: "The Guardian",
      category: article.pillarName,
      author: article.fields.byline,
      publishedAt: article.webPublicationDate,
    }));
  } catch (error) {
    console.error("Error fetching Guardian news:", error);
    return [];
  }
};

export const fetchNYTNews = async (
  query: string,
  page: number,
  dateFrom: string,
  dateTo: string
): Promise<Article[]> => {
  try {
    const response = await nytApi.get("/articlesearch.json", {
      params: {
        "api-key": NYT_API_KEY,
        q: query,
        page: page - 1,
        fl: "headline,abstract,web_url,pub_date,multimedia,section_name,byline",
        dateFrom,
        dateTo,
      },
    });

    return response.data.response.docs.map((article: any) => {
      const multimedia = article.multimedia.find(
        (media: any) => media.type === "image"
      );
      return {
        id: Math.random().toString(36).substring(7),
        title: article.headline.main,
        description: article.abstract,
        url: article.web_url,
        imageUrl: `https://www.nytimes.com/${
          multimedia
            ? multimedia.url
            : "images/2014/07/16/arts/jpcomedy1/jpcomedy1-thumbWide.jpg"
        }`,
        source: "New York Times",
        category: article.section_name || "U.S.",
        author: article.byline?.original?.replace("By ", ""),
        publishedAt: article.pub_date,
      };
    });
  } catch (error) {
    console.error("Error fetching NYT news:", error);
    return [];
  }
};

export const fetchNewsAPI = async (
  query: string,
  page: number,
  dateFrom: string,
  dateTo: string
): Promise<Article[]> => {
  try {
    const response = await newsApi.get("/everything", {
      params: {
        apiKey: NEWS_API_KEY,
        q: query || "top-headlines",
        language: "en",
        pageSize: 10,
        page,
        dateFrom,
        dateTo,
      },
    });

    return response.data.articles.map((article: any) => ({
      id: Math.random().toString(36).substring(7),
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
      category: "General",
      author: article.author,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching NewsAPI news:", error);
    return [];
  }
};

export const fetchAllNews = async (
  query: string,
  page: number,
  dateFrom: string,
  dateTo: string
): Promise<Article[]> => {
  try {
    const [guardianNews, nytNews, newsApiNews] = await Promise.all([
      fetchGuardianNews(query, page, dateFrom, dateTo),
      fetchNYTNews(query, page, dateFrom, dateTo),
      fetchNewsAPI(query, page, dateFrom, dateTo),
    ]);

    return [...guardianNews, ...nytNews, ...newsApiNews];
  } catch (error) {
    console.error("Error fetching news from all sources:", error);
    return [];
  }
};
