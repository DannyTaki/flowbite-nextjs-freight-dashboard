import type { SingleChemicalData } from "@/helpers/getData";
import { getChemicalData, updateChemicalEntry } from "@/helpers/getData"; // adjust the import path as necessary
import { useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Modal, Spinner, Table } from "flowbite-react";
import React, { useState } from "react";

export default function Chemicals() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedChemical, setSelectedChemical] =
    useState<SingleChemicalData | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedChemical) {
      await updateChemicalEntry(selectedChemical);
      setOpenModal(false);
      // Optionally, you can refetch the data or update the local state to reflect the changes
    }
  };

  const handleInputChange = (
    field: keyof SingleChemicalData,
    value: string | boolean | null,
  ) => {
    setSelectedChemical((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <div className="overflow-x-auto">
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Update Chemical Entry</Modal.Header>
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
                  required={true}
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
                  required={true}
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
                    handleInputChange("freightClass", e.target.value)
                  }
                  type="text"
                  name="freight-class"
                  id="freight-class"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Freight Class"
                  required={true}
                  value={selectedChemical?.freightClass || ""}
                />
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1">
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
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="hazard-id"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Hazard ID
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("hazardId", e.target.value)
                  }
                  type="text"
                  name="hazard-id"
                  id="hazard-id"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Hazard ID"
                  required={true}
                  value={selectedChemical?.hazardId || ""}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label
                  htmlFor="packing-group"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Packing Group
                </label>
                <input
                  onChange={(e) =>
                    handleInputChange("packingGroup", e.target.value)
                  }
                  type="text"
                  name="packing-group"
                  id="packing-group"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  placeholder="Type Packing Group"
                  required={true}
                  value={selectedChemical?.packingGroup || ""}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Update Entry</Button>
        </Modal.Footer>
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
          <Table.HeadCell>Packing Group</Table.HeadCell>
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
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.classificationId}
              </Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.nmfc}</Table.Cell>
              <Table.Cell>{item.sub || ""}</Table.Cell>
              <Table.Cell>{item.freightClass}</Table.Cell>
              <Table.Cell>{item.hazardous ? "Yes" : "No"}</Table.Cell>
              <Table.Cell>{item.hazardId || ""}</Table.Cell>
              <Table.Cell>{item.packingGroup || ""}</Table.Cell>
              <Table.Cell>
                <button
                  onClick={() => {
                    setOpenModal(true);
                    setSelectedChemical(item);
                  }}
                >
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
