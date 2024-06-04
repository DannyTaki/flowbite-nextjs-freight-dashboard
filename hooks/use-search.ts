import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import algoliasearch from 'algoliasearch/lite';
import type { MultipleQueriesResponse, SearchResponse } from '@algolia/client-search';
import { Product } from '@/types/links/product';

const searchClient = algoliasearch('PRRV6UCPXG', '3c47055a99693c67accdbba674a35f16');

export function useSearch(query: string) {
  const queryClient = useQueryClient();

  const queries = [
    {
      indexName: "product_freight_linkages",
      params: {
        query: query,
      },
    },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: async (): Promise<Product[]> => {
        const response: MultipleQueriesResponse<unknown>  = await searchClient.search(queries);
        const searchResults = response.results[0] as SearchResponse<Product>;

        if ('hits' in searchResults) {
            queryClient.invalidateQueries({queryKey: ['searchResults', query]});
            return searchResults.hits;
        }

        return [];
    },
  });

  return { data, isLoading, error};
}