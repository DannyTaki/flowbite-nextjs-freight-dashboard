import { getUnlinkedProducts } from "@/helpers/getData";
import { useQuery } from "@tanstack/react-query";
import { Table } from "flowbite-react";

export default function UnlinkedProducts() {

    const { data, isLoading, error } = useQuery({queryKey: ['unlinkedProducts'], queryFn: () => getUnlinkedProducts()})

    return (
        <div className="overflow-x-auto">
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
            {data?.map((item, index) => (
              <Table.Row
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {item.classification_id}
                </Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.packaging_type}</Table.Cell>
                <Table.Cell>{item.product_id}</Table.Cell>
                <Table.Cell>{item.sku}</Table.Cell>
                <Table.Cell>{item.unit_container_type}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
}