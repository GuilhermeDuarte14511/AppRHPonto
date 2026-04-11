import type { GlobalSearchResponse } from './global-search-contracts';

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível consultar a busca global.');
  }

  return (await response.json()) as T;
};

export const fetchGlobalSearchResults = async (term: string): Promise<GlobalSearchResponse> => {
  const searchParams = new URLSearchParams({
    q: term,
  });
  const response = await fetch(`/api/admin/search?${searchParams.toString()}`, {
    credentials: 'include',
  });

  return handleJsonResponse<{ data: GlobalSearchResponse }>(response).then((payload) => payload.data);
};
