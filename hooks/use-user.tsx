// hooks/use-user.ts
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import {
  ApiResponse,
  ApiSessionResponse,
  ArticleCreateDTO,
  ArticleDetailDTO,
  ArticleListItemDTO,
  UserLookupDTO,
} from "@/types/dto";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/app/Provider";
import { useDebounce } from "./use-debounce";

/* ---------------- SESSION ---------------- */

export const useSession = () => {
  const { data, isLoading } = useQuery<ApiSessionResponse>({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await authClient.getSession();
      return res.data as ApiSessionResponse;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { session: data, isLoading };
};

/* ---------------- USER ARTICLES ---------------- */
export const useUserArticles = () => {
  const { data, isLoading } = useQuery<ArticleListItemDTO[]>({
    queryKey: ["userArticles"],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<ArticleListItemDTO[]>>(
        "/api/articles/user"
      );

      if (!res.success) {
        throw new Error(res.error || "Failed to fetch articles");
      }
      
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

 const submitArticle = useMutation<ArticleDetailDTO, Error, ArticleCreateDTO>({
   mutationFn: async (payload) => {
     const res = await apiPost<ApiResponse<ArticleDetailDTO>, ArticleCreateDTO>(
       "/api/articles/user",
       payload
     );

     if (!res.success) {
       throw new Error(res.error || "Failed to submit article");
     }

     return res.data;
   },
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["userArticles"] });
   },
 });

  // ✅ UPDATE ARTICLE
  const updateArticle = useMutation<
    ArticleDetailDTO,
    Error,
    { articleId: string; title?: string; abstract?: string }
  >({
    mutationFn: async (payload) => {
      const res = await apiPut<ApiResponse<ArticleDetailDTO>, typeof payload>(
        "/api/articles/user",
        payload
      );

      if (!res.success) {
        throw new Error(res.error || "Failed to update article");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userArticles"] });
    },
  });

  // ✅ WITHDRAW ARTICLE
  const withdrawArticle = useMutation<
    ArticleDetailDTO,
    Error,
    { articleId: string }
  >({
    mutationFn: async ({ articleId }) => {
      const res = await apiDelete<ApiResponse<ArticleDetailDTO>>(
        `/api/articles/user?articleId=${encodeURIComponent(articleId)}`
      );

      if (!res.success) {
        throw new Error(res.error || "Failed to withdraw article");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userArticles"] });
    },
  });

  return {
    articles: data,
    isLoading,
    submitArticle,
    updateArticle,
    withdrawArticle,
  };
};


export const useUserSearchSuggestions = (rawQuery: string) => {
  const debounced = useDebounce(rawQuery, 300);
  const trimmed = debounced.trim();

  const queryResult = useQuery<UserLookupDTO[], Error>({
    queryKey: ["userSearch", trimmed],
    queryFn: async () => {
      if (!trimmed || trimmed.length < 2) {
        return [];
      }

      const res = await apiGet<ApiResponse<UserLookupDTO[]>>(
        `/api/articles/user/search?query=${encodeURIComponent(trimmed)}`
      );

      if (!res.success) {
        throw new Error(res.error || "Failed to search users");
      }

      return res.data;
    },
    enabled: trimmed.length >= 2, // don't fire for very short input
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return {
    suggestions: queryResult.data ?? [],
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error ?? null,
  };
};