import { useQuery, useQueryClient } from '@tanstack/react-query';
import algoliasearch from 'algoliasearch/lite';


const searchClient = algoliasearch('PRRV6UCPXG', '3c47055a99693c67accdbba674a35f16');

export function useSearch<T>(query: string, indexName: string) {
  const queryClient = useQueryClient();
  
  const index = searchClient.initIndex(indexName);

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: async (): Promise<T[]> => {
      const response = await index.search<T>(query);
      return response.hits;
    }, 
    enabled: !!query,
    });

  return { data, isLoading, error};
}