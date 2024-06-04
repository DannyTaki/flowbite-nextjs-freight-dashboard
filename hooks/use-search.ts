import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import algoliasearch from 'algoliasearch/lite';
import type { MultipleQueriesResponse, SearchResponse } from '@algolia/client-search';
import { Product } from '@/types/links/product';

const searchClient = algoliasearch('PRRV6UCPXG', '3c47055a99693c67accdbba674a35f16');

export function useSearch(query: string) {
  const queryClient = useQueryClient();
  
  const index = searchClient.initIndex('product_freight_linkages');

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: async (): Promise<Product[]> => {
      const response = await index.search<Product>(query);
      return response.hits;
    }, 
    enabled: !!query,
    });

  return { data, isLoading, error};
}