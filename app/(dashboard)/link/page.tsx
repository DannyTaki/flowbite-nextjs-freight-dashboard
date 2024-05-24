"use client";

import { getUnlinkedProducts } from "@/helpers/getData";
import { useQuery } from "@tanstack/react-query";
import { Table, TextInput, Button, Checkbox } from "flowbite-react";
import { useState } from "react";
import { map } from "zod";

export default function UnlinkedProducts() {
    const [selectedRows, setSelectedRows]  = useState<number[]>([]);
    const [classificationIds, setClassifications] = useState<{[key: number]: string}>({});
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
      }))
    }

    async function handleAdd() {
      const selectedData = data?.filter(item => selectedRows.includes(item.product_id as number));
      
      const updates = selectedData?.map(item => ({
        link_id: item.link_id,
        classification_id: classificationIds[item.product_id as number] || ""
      }));

      try {
        await Promise.all(updates.map(update => updateProductFreightLink(update.link_id as number, update.classification_id)));
        // Optionally refetch data or provide feedback
      } catch (error) {
        console.error("Error updating product freight links:", error);
      }
    }

    async function updateProductFreightLink(link_id: number, classification_id: string) {
      // Replace with your actual update logic, e.g., an API call
      const response = await fetch('/api/updateProductFreightLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link_id, classification_id }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update product freight link');
      }
    }

    const allSelected = selectedRows.length === data?.length;

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
            <Table.HeadCell><Button color="success">Add</Button></Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {data?.map((item, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                  <Table.Cell className="p-4">
                  <Checkbox checked={selectedRows.includes(item.product_id as number)} onChange={() => handleRowSelect(item.product_id as number)} />
              </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.product_id}
                </Table.Cell>
                <Table.Cell>{item.sku}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell><TextInput /></Table.Cell>        
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
}