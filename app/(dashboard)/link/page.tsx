"use client";

import { getUnlinkedProducts, updateProductFreightLink } from "@/helpers/getData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TextInput, Button, Checkbox, Pagination } from "flowbite-react";
import React, { useState } from "react";
import { useSearch} from "@/hooks/use-search";


export default function UnlinkedProducts() {
    const [selectedRows, setSelectedRows]  = useState<number[]>([]);
    const [classificationIds, setClassifications] = useState<{[key: number]: string}>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const queryClient = useQueryClient();
  
    const { data: searchData, isLoading: searchLoading, error: searchError } = useSearch();
    const { data, isLoading, error } = useQuery({queryKey: ['unlinkedProducts'], queryFn: () => getUnlinkedProducts()})
    

    function handleRowSelect(product_id: number) {
      setSelectedRows((prevSelected) => 
        prevSelected.includes(product_id)
        ? prevSelected.filter((id) => id !== product_id)
        : [...prevSelected, product_id],
      );
    };

    function handleSelectAll() {
      if(selectedRows.length === data?.length) {
        setSelectedRows([]);
      } else {
        const allProductsIds = data?.map((item) => item.product_id  as number) || [];
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
      const selectedData = data?.filter(item => selectedRows.includes(item.product_id as number));
      console.log(selectedData);
      const updates = selectedData?.map(item => ({
        link_id: Number(item.link_id),
        classification_id: Number(classificationIds[item.product_id as number])
      }));

      try {
        const response = await updateProductFreightLink(updates as {link_id: number, classification_id: number}[]);
        console.log(response);
        queryClient.invalidateQueries({ queryKey: ['unlinkedProducts']});
        
      } catch (error) {
        console.error("Error adding classification:", error); 
      }
    }

    const currentData = searchData;
    const allSelected = selectedRows.length === data?.length;

    const totalItems = data?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPageData = currentData?.slice(startIndex, startIndex + itemsPerPage) || [];

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
                    <Table.HeadCell><Button color="success" onClick={handleAdd}>Add</Button></Table.HeadCell>
                    <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                    </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                    {currentPageData.map((item, index) => (
                        <Table.Row
                            key={index}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell className="p-4">
                                <Checkbox checked={selectedRows.includes(item.product_id as number) || !!classificationIds[item.product_id as number]} onChange={() => handleRowSelect(item.product_id as number)} />
                            </Table.Cell>
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {item.product_id}
                            </Table.Cell>
                            <Table.Cell>{item.sku}</Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>
                                <TextInput
                                    value={classificationIds[item.product_id as number] || ""}
                                    onChange={(e) => handleClassificationIdChange(item.product_id as number, e.target.value)}
                                />
                            </Table.Cell>        
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            <div className="flex overflow-x-auto sm:justify-center mt-4">
                <Pagination layout="table" currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
            </div>
        </div>
    )
}