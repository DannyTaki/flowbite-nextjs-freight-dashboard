"use client";

import { getProducts, updateProduct } from "@/helpers/getData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner, Table, Modal, Button } from "flowbite-react";
import { useSearch } from "@/hooks/use-search";
import { InsertProduct, SelectProduct } from "@/types/db/types";
import { useState, useCallback } from "react";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import MemoizedRow from "@/components/row";
import ProductModal from "@/components/productmodal";

const productSchema = z.object({
  product_id: z.number(),
  sku: z.string(),
  name: z.string(),
  packaging_type: z.string().nullable(),
  unit_container_type: z.string().nullable(),
});

export default function Products({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {
  const query = searchParams?.query || '';
  const [openModal, setOpenModal] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState<SelectProduct | null>(null);
  const [localInput, setLocalInput] = useState<{ packaging_type?: string; unit_container_type?: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  const { data: productData, error: productError, isLoading: productIsLoading } = useSearch<SelectProduct>(query, "products");

  const openEditModal = (item: SelectProduct) => {
    setOpenModal(true);
    setLocalInput({
      packaging_type: item.packaging_type ?? undefined,
      unit_container_type: item.unit_container_type ?? undefined,
    });
  };

  const debouncedUpdateChemical = useDebouncedCallback((updatedChemical: SelectProduct) => {
    setSelectedChemical(updatedChemical);
  }, 100);

  const handleInputChange = (field: string, value: string) => {
    setLocalInput((prev) => (prev ? { ...prev, [field]: value } : { [field]: value }));
  };

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowToast(false);
    console.log(selectedChemical);
    if (selectedChemical) {
      try {
        const validatedData = productSchema.parse({
          product_id: selectedChemical.product_id,
          sku: selectedChemical.sku,
          name: selectedChemical.name,
          packaging_type: selectedChemical.packaging_type || null,
          unit_container_type: selectedChemical.unit_container_type || null,
        });

        await updateProduct([validatedData] as InsertProduct[]);
        setOpenModal(false);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } catch (e) {
        if (e instanceof z.ZodError) {
          console.log(e.issues);
          const newErrors: Record<string, string> = {};
          e.errors.forEach((error) => {
            if (error.path && error.path[0]) {
              newErrors[error.path[0] as string] = error.message;
              console.log(error.message);
              setToastMessage(error.message);
              setShowToast(true);
              setOpenModal(false);
            }
          });
        }
      }
    }
  }, [selectedChemical, queryClient]);

  if (error || productError) {
    console.log(error);
    return <div>Error loading products.</div>;
  }

  if (isLoading || productIsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-36 w-36" />
      </div>
    );
  }

  const currentData = productData?.length ? productData : data;

  return (
    <div className="overflow-x-auto">
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <form className="p-4 md:p-5" onSubmit={handleFormSubmit}>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="Packaging Type"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Packaging Type
                </label>
                <input
                  onChange={(e) => handleInputChange("packaging_type", e.target.value)}
                  type="text"
                  name="packaging_type"
                  id="packaging_type"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type the packaging type"
                  required={true}
                  value={localInput?.packaging_type || ""}
                />
              </div>
              <div>
                <label
                  htmlFor="Unit Container Type"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Unit Container Type
                </label>
                <input
                  onChange={(e) => handleInputChange("unit_container_type", e.target.value)}
                  type="text"
                  name="unit_container_type"
                  id="unit_container_type"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type the packaging type"
                  required={true}
                  value={localInput?.unit_container_type || ""}
                />
              </div>
            </div>
            <Modal.Footer className="flex justify-center">
              <Button type="submit">Update</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
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
        </Table.Head>
        <Table.Body className="divide-y">
          {currentData?.map((item, index) => (
            <MemoizedRow key={index} item={item} openEditModal={openEditModal} />
          ))}
        </Table.Body>
      </Table>
      <ProductModal
        show={openModal}
        onClose={() => setOpenModal(false)}
        localInput={localInput}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        />
    </div>
  );
}
