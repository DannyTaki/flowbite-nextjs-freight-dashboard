import useAlgolia from '@/hooks/useAlgolia';

type Product = {
    product_id: number;
    sku: string;
    name: string;
    packaging_type: string;
    unit_container_type: string;
    link_id: number;
    classification_id: number;
};

type SearchResultsProps = {
  query: string;
};

export default function SearchResults({ query = '' }: SearchResultsProps) {
  const {
    hits,
    isLoading,
    isFetching,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAlgolia<Product>({
    indexName: 'product_freight_linkages',
    query,
    hitsPerPage: 5,
    staleTime: 1000 * 30, // 30s
    gcTime: 1000 * 60 * 15, // 15m
  });

  if (!query) return null;

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="search-status">
        Status: {status} {isFetching && <span>fetching...</span>}
      </div>
      <div>
        <div className="search-result">
          {hits && hits.length > 0 ? (
            hits.map((product) => (
              <li key={product.objectID} className="product">
                <span className="product-id">ID: {product.product_id}</span><br />
                <span className="product-sku">SKU: {product.sku}</span><br />
                <span className="product-name">Name: {product.name}</span><br />
                <span className="product-packaging">Packaging Type: {product.packaging_type}</span><br />
                <span className="product-container">Container Type: {product.unit_container_type}</span><br />
                <span className="product-link-id">Link ID: {product.link_id}</span><br />
                <span className="product-classification">Classification ID: {product.classification_id}</span>
              </li>
            ))
          ) : (
            <h3>No products found!</h3>
          )}
        </div>
        {hasNextPage && (
          <div className="search-more" onClick={() => fetchNextPage()}>
            more
          </div>
        )}
        {isFetchingNextPage && (
          <div className="search-status">Fetching next page...</div>
        )}
      </div>
    </div>
  );
}
