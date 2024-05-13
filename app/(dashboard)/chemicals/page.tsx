import { useQuery } from "@tanstack/react-query";
import { Checkbox, Table, Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { getChemicalData, updateChemicalEntry, ChemicalData } from "@/helpers/getData"; // adjust the import path as necessary

export default function Chemicals() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState<ChemicalData | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["chemicals"],
    queryFn: () => getChemicalData(),
  });

  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-36 h-36" />
      </div>
    );
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedChemical) {
      await updateChemicalEntry(selectedChemical);
      setOpenModal(false);
      // Optionally, you can refetch the data or update the local state to reflect the changes
    }
  };

  return (
    <div className="overflow-x-auto">
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Update Chemical Entry</Modal.Header>
        <Modal.Body>
          <form className="p-4 md:p-5" onSubmit={handleFormSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <input
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, description: e.target.value }))}
                  type="text"
                  name="description"
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type description"
                  required={true}
                  value={selectedChemical?.description || ''}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="nmfc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NMFC</label>
                <input
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, nmfc: e.target.value }))}
                  type="text"
                  name="nmfc"
                  id="nmfc"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type NMFC"
                  required={true}
                  value={selectedChemical?.nmfc || ''}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="sub" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SUB</label>
                <input
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, sub: e.target.value }))}
                  type="text"
                  name="sub"
                  id="sub"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type SUB"
                  required={true}
                  value={selectedChemical?.sub || ''}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="freight-class" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Freight Class</label>
                <input
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, freightClass: e.target.value }))}
                  type="text"
                  name="freight-class"
                  id="freight-class"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Freight Class"
                  required={true}
                  value={selectedChemical?.freightClass || ''}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="hazardous" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hazardous</label>
                <select
                  id="hazardous"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={selectedChemical?.hazardous ? "Yes" : "No"}
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, hazardous: e.target.value === "Yes" }))}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="hazard-id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hazard ID</label>
                <input
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, hazardId: e.target.value }))}
                  type="text"
                  name="hazard-id"
                  id="hazard-id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Hazard ID"
                  required={true}
                  value={selectedChemical?.hazardId || ''}
                />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="packing-group" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Packing Group</label>
                <input
                  onChange={(e) => setSelectedChemical(prev => ({ ...prev, packingGroup: e.target.value }))}
                  type="text"
                  name="packing-group"
                  id="packing-group"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type Packing Group"
                  required={true}
                  value={selectedChemical?.packingGroup || ''}
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
            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.classificationId}
              </Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{item.nmfc}</Table.Cell>
              <Table.Cell>{item.sub || ''}</Table.Cell>
              <Table.Cell>{item.freightClass}</Table.Cell>
              <Table.Cell>{item.hazardous ? 'Yes' : 'No'}</Table.Cell>
              <Table.Cell>{item.hazardId || ''}</Table.Cell>
              <Table.Cell>{item.packingGroup || ''}</Table.Cell>
              <Table.Cell>
                <button onClick={() => { setOpenModal(true); setSelectedChemical(item); }}>
                  <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
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
