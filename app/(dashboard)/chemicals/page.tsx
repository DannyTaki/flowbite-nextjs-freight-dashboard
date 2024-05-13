"use client";

import { getChemicalData } from "@/helpers/getData";
import { useQuery } from "@tanstack/react-query";
import { index } from "drizzle-orm/mysql-core";
import { Checkbox, DrawerItems, TabItem, Table, Modal, Button, Spinner } from "flowbite-react";
import { useState } from "react";


interface ChemicalData {
  classificationId: number;
  description: string | null;
  nmfc: string | null;
  freightClass: string;
  hazardous: boolean | null;
  hazardId: string | null;
  packingGroup: string | null;
  sub: string | null;
  // Add additional methods and properties required by drizzle-orm
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
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input type="text" name="description" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required={true} value={selectedChemical?.description ? selectedChemical.description : null}  />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                        <input type="number" name="price" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required={true} />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                            <option selected={true}>Select category</option>
                            <option value="TV">TV/Monitors</option>
                            <option value="PC">PC</option>
                            <option value="GA">Gaming/Console</option>
                            <option value="PH">Phones</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                        <textarea id="description"  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write product description here"></textarea>                    
                    </div>
                </div>
                <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                    Add new product
                </button>
            </form>
          </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
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
