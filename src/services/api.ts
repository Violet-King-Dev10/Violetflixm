import axios from 'axios';
import { ApiResponse, Subject } from '../types';

const MOVIE_API_BASE_URL = 'https://movieapi.xcasper.space/api';
const VIP_API_BASE_URL = 'https://api.onspace.ai/api';
const SPORT_API_BASE_URL = 'https://omegatech-api.dixonomega.tech/api';

// ====================== MOVIE SERVICES ======================
const extractData = <T>(payload: any): T => {
  if (payload?.data?.data !== undefined) return payload.data.data as T;
  if (payload?.data !== undefined) return payload.data as T;
  return payload as T;
};

const extractSubjectList = (payload: any): Subject[] => {
  const root = extractData<any>(payload);
  if (Array.isArray(root?.subjectList)) return root.subjectList;
  if (Array.isArray(root?.list)) return root.list;
  if (Array.isArray(root)) return root;
  return [];
};

const getFromMovieApi = async <T>(path: string, params?: Record<string, string | number | undefined>) => {
  try {
    return await axios.get<T>(`\( {MOVIE_API_BASE_URL} \){path}`, { params });
  } catch {
    return axios.get<T>(`/api/proxy/movie${path}`, { params });
  }
};

export const movieService = {
  getTrending: async (page = 0, perPage = 20) => {
    const response = await getFromMovieApi<ApiResponse<{ subjectList: Subject[] }>>('/trending', { page, perPage });
    return extractSubjectList(response.data);
  },

  getDetail: async (subjectId: string) => {
    const response = await getFromMovieApi<ApiResponse<{ subject: Subject }>>('/detail', { subjectId });
    const root = extractData<any>(response.data);
    return root?.subject || root;
  },

  getPlayData: async (subjectId: string) => {
    try {
      const response = await axios.get(`${MOVIE_API_BASE_URL}/play`, { params: { subjectId } });
      return extractData<any>(response.data);
    } catch {
      const response = await axios.get(`/api/proxy/play`, { params: { subjectId } });
      return extractData<any>(response.data);
    }
  },

  search: async (keyword: string, page = 1, perPage = 20) => {
    const response = await getFromMovieApi<ApiResponse<{ subjectList: Subject[] }>>('/search', { keyword, page, perPage });
    return extractSubjectList(response.data);
  },

  getHot: async () => {
    const response = await getFromMovieApi<ApiResponse<{ subjectList: Subject[] }>>('/hot');
    return extractSubjectList(response.data);
  },

  getBrowse: async (subjectType: number, page = 1, perPage = 18) => {
    const response = await getFromMovieApi<ApiResponse<{ subjectList: Subject[] }>>('/browse', { subjectType, page, perPage });
    return extractSubjectList(response.data);
  },

  getRanking: async (page = 1, perPage = 18) => {
    const response = await getFromMovieApi<ApiResponse<{ subjectList: Subject[] }>>('/ranking', { page, perPage });
    return extractSubjectList(response.data);
  },

  getRecommendations: async (subjectId: string, page = 1, perPage = 10) => {
    const response = await getFromMovieApi<ApiResponse<{ subjectList: Subject[] }>>('/recommend', { subjectId, page, perPage });
    return extractSubjectList(response.data);
  },
};

// ====================== SPORTS SERVICES ======================
export const sportsService = {
  getScores: async (limit = 10) => {
    try {
      const res = await axios.get(`\( {SPORT_API_BASE_URL}/tools/scores?limit= \){limit}`);
      return res.data?.matches || res.data?.data || res.data || [];
    } catch (err) {
      console.error('Scores API error:', err);
      return [];
    }
  },

  getSportTrend: async (page = 1, perPage = 6) => {
    try {
      const res = await axios.get(`\( {SPORT_API_BASE_URL}/Sport/sport-trend?page= \){page}&perPage=${perPage}`);
      return res.data?.news || res.data?.data || res.data?.list || [];
    } catch (err) {
      console.error('Sport trend API error:', err);
      return [];
    }
  },

  getMatchDetail: async (id: number | string) => {
    try {
      const res = await axios.get(`\( {SPORT_API_BASE_URL}/Sport/match-detail?id= \){id}`);
      return res.data;
    } catch (err) {
      console.error('Match detail API error:', err);
      return null;
    }
  },
};

// ====================== ANIME + PROFILE ======================
export const animeService = {
  search: async (query: string) => {
    const response = await axios.get(`/api/proxy/anime/search?query=${encodeURIComponent(query)}`);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.animes)) return data.animes;
    return [];
  },
  getDetail: async (url: string) => {
    const response = await axios.get(`/api/proxy/anime/detail?url=${encodeURIComponent(url)}`);
    const data = response.data;
    if (data && data.title) return data;
    if (data && data.data && data.data.title) return data.data;
    return data;
  },
  getDownload: async (url: string) => {
    const response = await axios.get(`/api/proxy/anime/download?url=${encodeURIComponent(url)}`);
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  }
};

export const profileService = {
  getProfile: async () => {
    const response = await axios.get('/api/user/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await axios.patch('/api/user/profile', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },
  addToHistory: async (movie: any) => {
    await axios.post('/api/user/history', movie, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }
};
