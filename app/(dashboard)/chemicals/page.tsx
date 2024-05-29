"use client";

import type * as schema from "@/app/db/drizzle/schema";
import {
  addChemicalEntry,
  deleteChemicalEntries,
  getChemicalData,
  updateChemicalEntry,
} from "@/helpers/getData"; // adjust the import path as necessary
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Checkbox, Modal, Spinner, Table, Toast } from "flowbite-react";
import React, { useState } from "react";
import { HiExclamation } from "react-icons/hi";
import { z } from "zod";
import type { InsertFreightClassification, SelectFreightClassification } from "@/types/db/types";

const chemicalSchema = z.object({
  classification_id: z.number().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .nullable(),
  nmfc: z.string().nullable(),
  freight_class: z
    .string()
    .nullable(),
  hazardous: z.boolean().nullable(),
  hazard_id: z.string().nullable(),
  hazard_class: z.string().nullable(),
  packing_group: z.string().nullable(),
  sub: z.string().nullable(),
});
type ChemicalInput = z.infer<typeof chemicalSchema>;

export default function Chemicals() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedChemical, setSelectedChemical] =
    useState<Partial<ChemicalInput | null>>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["chemicals"],
    queryFn: () => getChemicalData(),
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

  const handleRowSelect = (classificationId: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(classificationId)
        ? prevSelected.filter((id) => id !== classificationId)
        : [...prevSelected, classificationId],
    );
  };

  const handleDelete = async () => {
    setToastMessage(null);
    setShowToast(false);
    if (selectedRows.length === 0) {
      setToastMessage("No rows selected for deletion");
      setShowToast(true);
      return;
    }

    try {
      await deleteChemicalEntries(selectedRows);
      setSelectedRows([]);
      queryClient.invalidateQueries({ queryKey: ["chemicals"] });
    } catch (error) {
      console.error("Error deleting entries:", error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowToast(false);
    console.log(selectedChemical);
    if (selectedChemical) {
      try {
        const validatedData = chemicalSchema.parse({
          classification_id: selectedChemical.classification_id ?? undefined,
          description: selectedChemical.description || null,
          nmfc: selectedChemical.nmfc || null,
          freight_class: selectedChemical.freight_class || null,
          hazardous: selectedChemical.hazardous || null,
          hazard_id: selectedChemical.hazard_id || null,
          hazard_class: selectedChemical.hazard_class || null,
          packing_group: selectedChemical.packing_group || null,
          sub: selectedChemical.sub || null,
        });

        if (isEditMode) {
          await updateChemicalEntry(
            validatedData as InsertFreightClassification,
          );
        } else {
          await addChemicalEntry(
            validatedData as InsertFreightClassification,
          );
        }
        setOpenModal(false);
        queryClient.invalidateQueries({ queryKey: ["chemicals"] });
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

  const handleInputChange = (
    field: keyof SelectFreightClassification,
    value: string | boolean | null,
  ) => {
    setSelectedChemical((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const openAddModal = () => {
    setSelectedChemical({
      description: undefined,
      nmfc: undefined,
      freight_class: undefined,
      hazardous: false,
      hazard_id: undefined,
      packing_group: undefined,
      sub: undefined,
    });
    setIsEditMode(false);
    setOpenModal(true);
  };

  const openEditModal = (item: SelectFreightClassification) => {
    setSelectedChemical(item);
    setIsEditMode(true);
    setOpenModal(true);
  };

  return (
    <div className="overflow-x-auto">
      {showToast && (
        <div className="fixed inset-0 z-50 mt-24 flex flex-col items-center">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
              <HiExclamation className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{toastMessage}</div>
            <Toast.Toggle onDismiss={() => setShowToast(false)} />
          </Toast>
        </div>
      )}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          {isEditMode ? "Update Chemical Entry" : "Add Chemical Entry"}
        </Modal.Header>
        <Modal.Body>
          <form className="p-4 md:p-5" onSubmit={handleFormSubmit}>
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  type="text"
                  name="description"
                  id="description"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type description"
                  required={true}
                  value={selectedChemical?.description || ""}
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="nmfc"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  NMFC
                </label>
                <input
                  onChange={(e) => handleInputChange("nmfc", e.target.value)}
                  type="text"
                  name="nmfc"
                  id="nmfc"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type NMFC"
                  required={false}
                  value={selectedChemical?.nmfc || ""}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="sub"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  SUB
                </label>
                <input
                  onChange={(e) => handleInputChange("sub", e.target.value)}
                  type="text"
                  name="sub"
                  id="sub"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type SUB"
                  required={false}
                  value={selectedChemical?.sub || ""}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="freight-class"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Freight Class
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("freight_class", e.target.value)
                  }
                  type="text"
                  name="freight-class"
                  id="freight-class"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Freight Class"
                  required={false}
                  value={selectedChemical?.freight_class || ""}
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-4 gap-3">
              <div className="col-span-4 sm:col-span-1">
                <label
                  htmlFor="hazardous"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Hazardous
                </label>
                <select
                  id="hazardous"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  value={selectedChemical?.hazardous ? "Yes" : "No"}
                  onChange={(e) =>
                    handleInputChange("hazardous", e.target.value === "Yes")
                  }
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-4 sm:col-span-1">
                <label
                  htmlFor="hazard-id"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Hazard ID
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("hazard_id", e.target.value)
                  }
                  type="text"
                  name="hazard-id"
                  id="hazard-id"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Hazard ID"
                  required={false}
                  value={selectedChemical?.hazard_id || ""}
                />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <label
                  htmlFor="hazard-class"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Hazard Class
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("hazard_class", e.target.value)
                  }
                  type="text"
                  name="hazard-class"
                  id="hazard-class"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Hazard Class"
                  required={false}
                  value={selectedChemical?.hazard_class || ""}
                />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <label
                  htmlFor="packing-group"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Packing Group
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("packing_group", e.target.value)
                  }
                  type="text"
                  name="packing-group"
                  id="packing-group"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Packing Group"
                  required={false}
                  value={selectedChemical?.packing_group || ""}
                />
              </div>
            </div>
            <Modal.Footer className="flex justify-center">
              <Button type="submit">{isEditMode ? "Update" : "Add"}</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox />
          </Table.HeadCell>
          <Table.HeadCell>Classification ID</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>NMFC</Table.HeadCell>
          <Table.HeadCell>Sub</Table.HeadCell>
          <Table.HeadCell>Freight Class</Table.HeadCell>
          <Table.HeadCell>Hazardous</Table.HeadCell>
          <Table.HeadCell>Hazard ID</Table.HeadCell>
          <Table.HeadCell>Hazard Class</Table.HeadCell>
          <Table.HeadCell>Packing Group</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
          <Table.HeadCell>
            <Button color="success" onClick={openAddModal}>
              Add
            </Button>
          </Table.HeadCell>
          <Table.HeadCell>
            <Button color="failure" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data?.map((item, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="p-4">
                <Checkbox
                  checked={selectedRows.includes(item.classification_id)}
                  onChange={() => handleRowSelect(item.classification_id)}
                />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.classification_id}
              </Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.nmfc}</Table.Cell>
              <Table.Cell>{item.sub || ""}</Table.Cell>
              <Table.Cell>{item.freight_class}</Table.Cell>
              <Table.Cell>{item.hazardous ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>{item.hazard_id || ""}</Table.Cell>
              <Table.Cell>{item.hazard_class}</Table.Cell>
              <Table.Cell>{item.packing_group || ""}</Table.Cell>
              <Table.Cell>
                <button onClick={() => openEditModal(item)}>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
