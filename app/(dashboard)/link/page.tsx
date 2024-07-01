"use client";

import {
  getUnlinkedProducts,
  updateProductFreightLink,
} from "@/helpers/getData";
import { useSearch } from "@/hooks/use-search";
import type { SelectProductFreightLinkage } from "@/types/db/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Pagination, Table, TextInput } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";

export default function UnlinkedProducts({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [classificationIds, setClassifications] = useState<{
    [key: number]: string;
  }>({});
  const [updateCounter, setUpdateCounter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const queryClient = useQueryClient();
  const [currentData, setCurrentData] = useState<
    SelectProductFreightLinkage[] | undefined
  >(undefined);

  const {
    data: unlinkedProductsData,
    isLoading: unlinkedProductsLoading,
    error: unlinkedProductsError,
  } = useQuery({
    queryKey: ["unlinkedProducts"],
    queryFn: () => getUnlinkedProducts(),
  });

  const {
    data: searchData,
    isLoading: searchIsLoading,
    error: searchError,
  } = useSearch<SelectProductFreightLinkage>(query, "product_freight_linkages");

  useEffect(() => {
    setCurrentData(query ? searchData : unlinkedProductsData);
  }, [query, searchData, unlinkedProductsData, updateCounter]);

  const allSelected = selectedRows.length === currentData?.length;

  const totalItems = useMemo(() => {
    if (!currentData) return 0;
    return currentData.filter((item) => item.classification_id === null).length;
  }, [currentData]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const filteredPageData = useMemo(() => {
    if (!currentData) return [];
    return currentData
      .filter((item) => item.classification_id === null)
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [currentData, currentPage, itemsPerPage]);

  const onPageChange = (page: number) => setCurrentPage(page);

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
    if (selectedRows.length === filteredPageData.length) {
      setSelectedRows([]);
    } else {
      const allProductsIds = filteredPageData.map(
        (item) => item.product_id as number,
      );
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
      console.log("Original data:", filteredPageData);
      console.log("Selected rows:", selectedRows);

      const updates = filteredPageData
        ?.filter((item) => selectedRows.includes(item.product_id as number))
        .map((item) => ({
          link_id: item.link_id as number, // Ensure link_id is a number
          classification_id: Number(
            classificationIds[item.product_id as number],
          ), // Ensure classification_id is a number
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

      // Manually remove updated items from local state
      const updatedProductIds = validUpdates.map((update) => update.link_id);
      setCurrentData((prevData) =>
        prevData?.filter(
          (item) => !updatedProductIds.includes(item.link_id as number),
        ),
      );

      queryClient.invalidateQueries({ queryKey: ["unlinkedProducts"] });
      queryClient.invalidateQueries({ queryKey: ["searchResults", query] });

      setSelectedRows([]);
      setClassifications({});
      setUpdateCounter((prev) => prev + 1);

      // Notify the opener (if it exists) that an update has occured
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage("classificationUpdated", "*");
      }
    } catch (error) {
      console.error("Error adding classification:", error);
    }
  }

  // const currentData = searchData || data;

  // Filter the data to only show items where classification_id is null
  // const filteredPageData = currentPageData.filter(
  //   (item) => item.classification_id === null,
  // );

  return (
    <div className="overflow-x-auto">
      <Table key={updateCounter}>
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
          {filteredPageData.map((item, index) => (
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
