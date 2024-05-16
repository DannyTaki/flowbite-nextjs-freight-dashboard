'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { getProducts } from "@/helpers/getData";
import { Table, Button } from "flowbite-react";
import type { Products } from "@/helpers/getData";
import { startBackgroundJob } from "@/app/actions/action";

export default function Products() {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({ queryKey: ["products"], queryFn: () => getProducts() })
  
  async function handleClick() {
    await startBackgroundJob();
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
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
          <Table.HeadCell>
            <Button onClick={handleClick} color="purple">Start Background Job</Button>
          </Table.HeadCell>
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

