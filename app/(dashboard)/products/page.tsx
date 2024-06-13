"use client";

import { getProducts, updateProduct } from "@/helpers/getData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner, Table, Modal, Button, Dropdown } from "flowbite-react";
import { useSearch } from "@/hooks/use-search";
import { InsertProduct, SelectProduct } from "@/types/db/types";
import { useState, useCallback } from "react";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import MemoizedRow from "@/components/row";
import ProductModal from "@/components/productmodal";

const productSchema = z.object({
  product_id: z.union([z.string(), z.number()]).transform((id) => typeof id === 'string' ? Number(id) : id),
  sku: z.string(),
  name: z.string(),
  packaging_type: z.string().nullable(),
  unit_container_type: z.string().nullable(),
});

const packagingTypes = ["Bag", "Bale", "Box", "Bucket", "Bundle", "Carton", "Case", "Crate", "Cylinder", "Drums", "Pail", "Pallet", "Pieces", "Reel", "Roll", "Skid", "Tote", "Tube"];
const unitContainerTypes = ["Bag", "Bale", "Box", "Bucket", "Bundle", "Carton", "Case", "Crate", "Cylinder", "Drums", "Pail", "Reel", "Roll", "Tote", "Tube"];

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [packagingLabel, setPackagingLabel] = useState("Packaging Type");
  const [unitContainerLabel, setUnitContainerLabel] = useState("Unit Container Type");

  const { data, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });
  const { data: productData, error: productError, isLoading: productIsLoading } = useSearch<SelectProduct>(query, "products");

  const openEditModal = (item: SelectProduct) => {
    setOpenModal(true);
    setSelectedChemical(item);
    setPackagingLabel("Packaging Type");
    setUnitContainerLabel("Unit Container Type");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

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
        <Modal.Header>Edit Product</Modal.Header>
        <Modal.Body>
          <form className="p-4 md:p-5" onSubmit={handleFormSubmit}>
            <div className="mb-4 flex justify-around">
              <div>
                <Dropdown label={packagingLabel} className="mb-2" dismissOnClick={true}>
                <Dropdown.Header>
                  <span className="block text-sm">Packaging Type</span>
                </Dropdown.Header>
                  {packagingTypes.map((option) => (
                    <Dropdown.Item key={option} onClick={() => {
                      if (selectedChemical) {
                        setSelectedChemical({ ...selectedChemical, packaging_type: option})
                        setPackagingLabel(option);
                      }
                    }}>{option}</Dropdown.Item>
                  ))}
                  </Dropdown>
                </div>
              <div>
              <Dropdown label={unitContainerLabel} className="mb-2" dismissOnClick={true}>
              <Dropdown.Header>
                  <span className="block text-sm">Unit Container Type</span>
                </Dropdown.Header>
                {unitContainerTypes.map((option) => (
                  <Dropdown.Item key={option} onClick={() => {
                    if (selectedChemical) {
                      setSelectedChemical({ ...selectedChemical, unit_container_type: option});
                      setUnitContainerLabel(option);
                    }
                  }}>{option}</Dropdown.Item>
                ))}
              </Dropdown>
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
    </div>
  );
}
