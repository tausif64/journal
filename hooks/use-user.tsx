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
  PaginationQueryDTO,
  PaginationMetaDTO,
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
export const useUserArticles = (params?: PaginationQueryDTO) => {
  const page = Math.max(1, params?.page ?? 1);
  const limit = Math.min(100, Math.max(1, params?.limit ?? 20));

  const { data, isLoading } = useQuery<ApiResponse<ArticleListItemDTO[]>>({
    queryKey: ["userArticles", page, limit],
    queryFn: async () => {
      const res = await apiGet<ApiResponse<ArticleListItemDTO[]>>(
        `/api/articles/user?page=${page}&limit=${limit}`
      );

      if (!res.success) {
        throw new Error(res.error || "Failed to fetch articles");
      }

      return res;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const articles: ArticleListItemDTO[] = data?.success ? data.data : [];

  const meta: PaginationMetaDTO =
    data?.success && data.meta
      ? data.meta
      : {
          limit,
          page,
          returned: articles.length,
        };

  const submitArticle = useMutation<ArticleDetailDTO, Error, ArticleCreateDTO>({
    mutationFn: async (payload) => {
      const res = await apiPost<
        ApiResponse<ArticleDetailDTO>,
        ArticleCreateDTO
      >("/api/articles/user", payload);

      if (!res.success) {
        throw new Error(res.error || "Failed to submit article");
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userArticles"] });
    },
  });

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
    articles,
    meta, 
    isLoading,
    submitArticle,
    updateArticle,
    withdrawArticle,
  };
};

/* ---------------- SINGLE ARTICLE HOOK ---------------- */

/**
 * React hook to fetch a single article (uses react-query).
 * Usage: const { article, isLoading, isError } = useArticleById(id);
 */
export const useArticleById = (articleId: string | null | undefined) => {
  const id = articleId ?? "";

  const query = useQuery<ArticleDetailDTO, Error>({
    queryKey: ["articleDetail", id],
    queryFn: async () => {
      if (!id) throw new Error("Article id is required");
      const res = await apiGet<ApiResponse<ArticleDetailDTO>>(
        `/api/articles/${encodeURIComponent(id)}`
      );
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch article");
      }
      return res.data;
    },
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    article: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch,
  };
};

/* ---------------- USER SEARCH SUGGESTIONS ---------------- */

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
    enabled: trimmed.length >= 2,
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
