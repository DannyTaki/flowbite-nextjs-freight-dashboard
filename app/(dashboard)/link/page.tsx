"use client";

import {
  getUnlinkedProducts,
  updateProductFreightLink,
} from "@/helpers/getData";
import { useSearch } from "@/hooks/use-search";
import type { SelectProductFreightLinkage } from "@/types/db/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Pagination, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

export default function UnlinkedProducts({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentSearchPage = Number(searchParams?.page) || 1;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [classificationIds, setClassifications] = useState<{
    [key: number]: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const queryClient = useQueryClient();

  const {
    data: searchData,
    isLoading: searchIsLoading,
    error: searchError,
  } = useSearch<SelectProductFreightLinkage>(query, "product_freight_linkages");
  const { data, isLoading, error } = useQuery({
    queryKey: ["unlinkedProducts"],
    queryFn: () => getUnlinkedProducts(),
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  function handleRowSelect(product_id: number) {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(product_id)
        ? prevSelected.filter((id) => id !== product_id)
        : [...prevSelected, product_id],
    );
  }

  function handleSelectAll() {
    if (selectedRows.length === data?.length) {
      setSelectedRows([]);
    } else {
      const allProductsIds =
        data?.map((item) => item.product_id as number) || [];
      setSelectedRows(allProductsIds);
    }
  }

  function handleClassificationIdChange(product_id: number, value: string) {
    setClassifications((prev) => ({
      ...prev,
      [product_id]: value,
    }));
    setSelectedRows((prevSelected) => {
      if (value && !prevSelected.includes(product_id)) {
        return [...prevSelected, product_id];
      } else if (!value && prevSelected.includes(product_id)) {
        return prevSelected.filter((id) => id !== product_id);
      } else {
        return prevSelected;
      }
    });
  }

  async function handleAdd() {
    try {
      // Check the original data and selectedRows
      console.log("Original data:", data);
      console.log("Selected rows:", selectedRows);

      const updates = currentData
        ?.filter((item) => selectedRows.includes(item.product_id as number))
        .map((item) => ({
          link_id: item.link_id as number, // Ensure link_id is a number
          classification_id: item.classification_id as number, // Ensure classification_id is a number
        }));
      // Log the updates array to see if the mapping is working correctly
      console.log("Updates:", updates);

      // Check if updates is empty
      if (!updates || updates.length === 0) {
        console.log("No updates to process.");
        return;
      }

      // Ensure updates conform to the expected type
      const validUpdates: { link_id: number; classification_id: number }[] =
        updates.filter(
          (item): item is { link_id: number; classification_id: number } =>
            item.link_id !== undefined && item.classification_id !== undefined,
        );

      // Check if validUpdates is empty
      if (validUpdates.length === 0) {
        console.log("No valid updates to process.");
        return;
      }

      const response = await updateProductFreightLink(validUpdates);
      console.log("Update response:", response);

      queryClient.invalidateQueries({ queryKey: ["unlinkedProducts"] });
    } catch (error) {
      console.error("Error adding classification:", error);
    }
  }

  const currentData = searchData || data;
  const allSelected = selectedRows.length === data?.length;

  const totalItems = currentData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData =
    currentData?.slice(startIndex, startIndex + itemsPerPage) || [];

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox checked={allSelected} onChange={handleSelectAll} />
          </Table.HeadCell>
          <Table.HeadCell>Product ID</Table.HeadCell>
          <Table.HeadCell>SKU</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Classification ID</Table.HeadCell>
          <Table.HeadCell>
            <Button color="success" onClick={handleAdd}>
              Add
            </Button>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentPageData.map((item, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="p-4">
                <Checkbox
                  checked={
                    selectedRows.includes(item.product_id as number) ||
                    !!classificationIds[item.product_id as number]
                  }
                  onChange={() => handleRowSelect(item.product_id as number)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.product_id}
              </Table.Cell>
              <Table.Cell>{item.sku}</Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>
                <TextInput
                  value={classificationIds[item.product_id as number] || ""}
                  onChange={(e) =>
                    handleClassificationIdChange(
                      item.product_id as number,
                      e.target.value,
                    )
                  }
                />
              </Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="mt-4 flex overflow-x-auto sm:justify-center">
        <Pagination
          layout="table"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
