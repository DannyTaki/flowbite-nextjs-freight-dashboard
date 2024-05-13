"use client";

import { getChemicalData } from "@/helpers/getData";
import { useQuery } from "@tanstack/react-query";
import { index } from "drizzle-orm/mysql-core";
import { Checkbox, DrawerItems, TabItem, Table, Modal, Button } from "flowbite-react";
import { useState } from "react";

export default function Chemicals() {
  const [openModal, setOpenModal] = useState(false);

  const { data, error } = useQuery({
    queryKey: ["chemicals"],
    queryFn: () => getChemicalData(),
  });
  if (data !== undefined && data !== null) {
    console.log(data);
  }
  if (error) {
    console.log(error);
  }



  return (
    <div className="overflow-x-auto">
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                companies around the world are updating their terms of service agreements to comply.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
                to ensure a common set of data rights in the European Union. It requires organizations to notify users as
                soon as possible of high-risk data breaches that could personally affect them.
              </p>
            </div>
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
              <button onClick={() => setOpenModal(true)}>
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
