"use client";

import { getProducts } from "@/helpers/getData";
import { useQuery } from "@tanstack/react-query";
import { Spinner, Table } from "flowbite-react";

export default function Products() {
  // const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-36 w-36" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Product ID</Table.HeadCell>
          <Table.HeadCell>SKU</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Packaging Type</Table.HeadCell>
          <Table.HeadCell>Unit Container Type</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data?.map((item, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.productId}
              </Table.Cell>
              <Table.Cell>{item.sku}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.packagingType}</Table.Cell>
              <Table.Cell>{item.unitContainerType}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
