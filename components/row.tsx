import React, { memo } from 'react';
import { Table, TableRowProps } from 'flowbite-react';
import { SelectProduct } from '@/types/db/types';


interface RowProps {
    item: SelectProduct;
    openEditModal: (item: SelectProduct) => void;
  }

const MemoizedRow: React.FC<RowProps> = memo(({ item, openEditModal }) => (
  <Table.Row
    key={item.product_id}
    className="bg-white dark:border-gray-700 dark:bg-gray-800"
  >
    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
      {item.product_id}
    </Table.Cell>
    <Table.Cell>{item.sku}</Table.Cell>
    <Table.Cell>{item.name}</Table.Cell>
    <Table.Cell>{item.packaging_type}</Table.Cell>
    <Table.Cell>{item.unit_container_type}</Table.Cell>
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
));

export default MemoizedRow;
