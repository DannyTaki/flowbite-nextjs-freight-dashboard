import { useQuery } from "@tanstack/react-query";
import alogiliasearch from "algoliasearch/lite";
import { MultipleQueriesQuery } from '@algolia/client-search';
import { useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";



const searchClient = alogiliasearch('PRRV6UCPXG','3c47055a99693c67accdbba674a35f16')

export function SearchComponent() {
    const [query, setQuery] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const queries: MultipleQueriesQuery[] = [
        {
          indexName: "products",
          params: {
            query: searchTerm,
          },
        },
      ]
    const { data, isLoading, error } = useQuery({queryKey: ["searchResults", searchTerm], queryFn: () => searchClient.search(queries)})

    function handleSubmit(formData: FormData) {
        setSearchTerm(formData.get("search") as string)
    }

    return (
        <form action={handleSubmit}>
        <div className="hidden lg:block lg:pl-2">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                className="w-full lg:w-96"
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            </form>
    )
}

