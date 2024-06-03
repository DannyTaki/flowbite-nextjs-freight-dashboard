import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import algoliasearch from 'algoliasearch/lite';
import type { MultipleQueriesResponse, SearchResponse } from '@algolia/client-search';
import { Product } from '@/types/links/product';

const searchClient = algoliasearch('PRRV6UCPXG', '3c47055a99693c67accdbba674a35f16');

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const queries = [
    {
      indexName: "products",
      params: {
        query: searchTerm,
      },
    },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", searchTerm],
    queryFn: async (): Promise<Product[]> => {
        if (!searchTerm) {
            return [];
        }
        const response: MultipleQueriesResponse<unknown>  = await searchClient.search(queries);
        const searchResults = response.results[0] as SearchResponse<Product>;

        if ('hits' in searchResults) {
            queryClient.invalidateQueries({queryKey: ['searchResults', searchTerm]});
            return searchResults.hits;
        }

        return [];
    },
  });

  return { data, isLoading, error, setSearchTerm };
}