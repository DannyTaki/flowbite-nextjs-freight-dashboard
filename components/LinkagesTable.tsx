import { useQuery } from "@tanstack/react-query";
import { getUnlinkedProducts, updateProductFreightLink } from "@/helpers/getData";

export default async function LinkagesTable({
    query, 
    currentPage, 
}: {
    query: string,
    currentPage: number,
}) {
    const product_freight_linkages = 
    const { data, isLoading, error } = useQuery({queryKey: ['unlinkedProducts'], queryFn: () => getUnlinkedProducts()})

}