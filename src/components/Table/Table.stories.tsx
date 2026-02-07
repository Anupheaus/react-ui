import { createStory } from '../../Storybook';
import { Table } from './Table';
import type { TableColumn, TableOnRequest } from './TableModels';
import { faker } from '@faker-js/faker';
import { useBound } from '../../hooks';
import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { to } from '@anupheaus/common';

interface DemoRecord {
  id: string;
  name: string;
  age: string;
  salary: number;
  isFullTime: boolean;
  email: string;
  phone: string;
  address: string;
}

const columns: TableColumn<DemoRecord>[] = [
  { id: '1', field: 'name', label: 'Name', type: 'string', width: 150 },
  { id: '2', field: 'age', label: 'Age (really long label)', type: 'number', width: 60, alignment: 'right' },
  { id: '3', field: 'salary', label: 'Salary', type: 'currency', width: 100, alignment: 'right' },
  { id: '4', field: 'isFullTime', label: 'Full Time?', type: 'boolean', width: 80, alignment: 'center' },
  { id: '5', field: 'email', label: 'Email', type: 'string', width: 200 },
  { id: '6', field: 'phone', label: 'Phone', type: 'string', width: 150 },
  { id: '7', field: 'address', label: 'Address', type: 'string', width: 200 },
];

faker.seed(10121);

const generateRecords = (count: number): DemoRecord[] => new Array(count).fill(0).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 100 }).toString(),
  salary: to.number(faker.finance.amount()) ?? 0,
  isFullTime: faker.datatype.boolean(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.location.streetAddress(),
}));

// const records = generateRecords(100);

const meta: Meta<typeof Table> = {
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table>;

export const Loading: Story = createStory({
  width: 1100,
  height: 200,
  render: () => {
    const [localColumns] = useState(columns);

    const handleRequest = useBound<TableOnRequest>(async () => {
      return new Promise(() => void 0);
    });

    const handleOnEdit = useBound((record: DemoRecord) => {
      // eslint-disable-next-line no-console
      console.log('Edit record:', record);
    });

    return (
      <Table
        columns={localColumns}
        onRequest={handleRequest}
        onEdit={handleOnEdit}
      />
    );
  },
});

export const RequestedRecords: Story = createStory({
  width: 700,
  height: 500,
  render: () => {
    const [localColumns] = useState(columns);

    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination }, response) => {
      const newRecords = generateRecords(pagination.limit);
      await Promise.delay(5000);
      response({
        requestId,
        records: newRecords,
        total: 10000,
      });
    });

    const handleOnEdit = useBound((record: DemoRecord) => {
      // eslint-disable-next-line no-console
      console.log('Edit record:', record);
    });

    return (
      <Table
        columns={localColumns}
        unitName="people"
        onRequest={handleRequest}
        onEdit={handleOnEdit}
      />
    );
  },
});

export const RequestedMinimumRecords: Story = createStory({
  width: 700,
  height: 200,
  render: () => {
    const [localColumns] = useState(columns);

    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async (request, response) => {
      const newRecords = generateRecords(2);
      response({
        records: newRecords,
        total: 2,
        requestId: request.requestId,
      });
    });

    const handleOnEdit = useBound((record: DemoRecord) => {
      // eslint-disable-next-line no-console
      console.log('Edit record:', record);
    });

    return (
      <Table
        columns={localColumns}
        unitName="people"
        onRequest={handleRequest}
        onEdit={handleOnEdit}
      />
    );
  },
});

export const TableUsingRecordIds: Story = createStory({
  width: 700,
  height: 500,
  render: () => {
    const [localColumns] = useState(columns);
    const generatedRecords = useMemo(() => generateRecords(2000), []);

    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      const newRecords = generatedRecords.slice(offset, offset + limit);
      response({
        requestId,
        records: newRecords,
        total: generatedRecords.length,
      });
    });

    const handleOnEdit = useBound((record: DemoRecord) => {
      // eslint-disable-next-line no-console
      console.log('Edit record:', record);
    });

    return (
      <Table
        columns={localColumns}
        unitName="people"
        onRequest={handleRequest}
        onEdit={handleOnEdit}
      />
    );
  },
});
