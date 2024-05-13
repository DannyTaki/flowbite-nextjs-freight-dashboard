"use client";

import { getChemicalData } from "@/helpers/getData";
import { useQuery } from "@tanstack/react-query";
import { index } from "drizzle-orm/mysql-core";
import { Checkbox, DrawerItems, TabItem, Table, Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";


interface ChemicalData {
  classificationId?: number;
  description?: string;  // Make description also optional
  nmfc?: string | null;
  freightClass?: string | null;
  hazardous?: boolean | null;
  hazardId?: string | null;
  packingGroup?: string | null;
  sub?: string | null;
}



export default function Chemicals() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState<ChemicalData | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["chemicals"],
    queryFn: () => getChemicalData(),
  });
  if (data !== undefined && data !== null) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-36 h-36" />
      </div>
    )
  }


  return (
    <div className="overflow-x-auto">
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Update Chemical Entry</Modal.Header>
        <Modal.Body>
          <form className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <input onChange={(e) => {
                  const updateChemical = { ...selectedChemical, description: e.target.value };
                  setSelectedChemical(updateChemical);
                }} type="text" name="description" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type description" required={true} value={selectedChemical?.description ? selectedChemical.description : ''} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="nmfc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NMFC</label>
                <input onChange={(e) => {
                  const updateChemical = { ...selectedChemical, nmfc: e.target.value };
                  setSelectedChemical(updateChemical);
                }} type="text" name="nmfc" id="nmfc" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type NMFC" required={true} value={selectedChemical?.nmfc ? selectedChemical.nmfc : ''} />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="sub" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SUB</label>
                <input onChange={(e) => {
                  const updateChemical = { ...selectedChemical, sub: e.target.value };
                  setSelectedChemical(updateChemical);
                }} type="text" name="sub" id="sub" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type SUB" required={true} value={selectedChemical?.sub ? selectedChemical.sub : ''} />
              </div>
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="freight-class" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SUB</label>
                <input onChange={(e) => {
                  const updateChemical = { ...selectedChemical, sub: e.target.value };
                  setSelectedChemical(updateChemical);
                }} type="text" name="freight-class" id="freight-class" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type Freight Class" required={true} value={selectedChemical?.sub ? selectedChemical.sub : ''} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="col-span-3 sm:col-span-1">
                <label htmlFor="hazardous" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hazardous</label>
                <select id="hazardous" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" >
                  <option value="Yes" selected={true}>Yes</option>
                  <option value="No">No</option>
                </select>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="hazard-id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hazard ID</label>
                  <input onChange={(e) => {
                    const updateChemical = { ...selectedChemical, hazardId: e.target.value };
                    setSelectedChemical(updateChemical);
                  }} type="text" name="hazardid" id="hazardid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type SUB" required={true} value={selectedChemical?.hazardId ? selectedChemical.hazardId : ''} />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label htmlFor="packing-group" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Packing Group</label>
                  <input onChange={(e) => {
                    const updateChemical = { ...selectedChemical, packingGroup: e.target.value };
                    setSelectedChemical(updateChemical);
                  }} type="text" name="packing-group" id="packing-group" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type Packing Group" required={true} value={selectedChemical?.packingGroup ? selectedChemical.packingGroup : ''} />
                </div>
            </div>
              {/* <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                Update Product
              </button> */}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Update Entry</Button>
          {/* <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button> */}
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
          )
          )};
        </Table.Body>
      </Table>
    </div>
  );
}



{/* <div className="col-span-3 sm:col-span-1">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                  <option selected={true}>Select category</option>
                  <option value="TV">TV/Monitors</option>
                  <option value="PC">PC</option>
                  <option value="GA">Gaming/Console</option>
                  <option value="PH">Phones</option>
                </select>
              </div> */}