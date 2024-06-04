"use client";

import { useEffect, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useSearch } from "@/hooks/use-search";
import { useSearchParams, useRouter, usePathname } from "next/navigation";



export function SearchComponent() {
 
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      replace(`${pathname}?${params.toString()}`);
      console.log(term);
    }

    return (
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
                defaultValue={searchParams.get("query")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>        
    )
}

