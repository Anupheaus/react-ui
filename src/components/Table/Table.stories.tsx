import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
import { Table } from './Table';
import type { TableColumn, TableOnRequest } from './TableModels';
import { faker } from '@faker-js/faker';
import { useBound } from '../../hooks';
import { useMemo, useState } from 'react';
import { to } from '@anupheaus/common';
import { expect, waitFor } from 'storybook/test';

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
    const handleRequest = useBound<TableOnRequest>(async () => new Promise(() => void 0));
    const handleOnEdit = useBound((record: DemoRecord) => {
       
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

const resizableColumns: TableColumn<DemoRecord>[] = [
  { id: '1', field: 'name', label: 'Name', type: 'string', width: 150, isResizable: true },
  { id: '2', field: 'age', label: 'Age', type: 'number', width: 60, alignment: 'right', isResizable: true },
  { id: '3', field: 'salary', label: 'Salary', type: 'currency', width: 100, alignment: 'right', isResizable: true },
  { id: '4', field: 'email', label: 'Email', type: 'string', width: 200, isResizable: true },
  { id: '5', field: 'phone', label: 'Phone', type: 'string', width: 150, isResizable: true },
  { id: '6', field: 'address', label: 'Address', type: 'string', width: 200, isResizable: true },
];

export const ResizableColumns: Story = createStory({
  width: 900,
  height: 500,
  render: () => {
    const [localColumns] = useState(resizableColumns);
    const generatedRecords = useMemo(() => generateRecords(200), []);

    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      const newRecords = generatedRecords.slice(offset, offset + limit);
      response({
        requestId,
        records: newRecords,
        total: generatedRecords.length,
      });
    });

    const handleOnEdit = useBound((record: DemoRecord) => {
       
      console.log('Edit record:', record);
    });

    return (
      <Table
        columns={localColumns}
        unitName="people"
        onRequest={handleRequest}
        onEdit={handleOnEdit}
        persistenceKey="storybook-table-resizable-columns"
      />
    );
  },
});

export const ResizableColumnsThreeRecords: Story = createStory({
  width: 900,
  height: 500,
  render: () => {
    const [localColumns] = useState(resizableColumns);
    const generatedRecords = useMemo(() => generateRecords(3), []);

    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      const newRecords = generatedRecords.slice(offset, offset + limit);
      response({
        requestId,
        records: newRecords,
        total: generatedRecords.length,
      });
    });

    const handleOnEdit = useBound((record: DemoRecord) => {
       
      console.log('Edit record:', record);
    });

    return (
      <Table
        columns={localColumns}
        unitName="people"
        onRequest={handleRequest}
        onEdit={handleOnEdit}
        persistenceKey="storybook-table-resizable-columns-three-records"
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

// ─── Footer stories ───────────────────────────────────────────────────────────

export const TableWithAddButton: Story = createStory({
  width: 700,
  height: 250,
  render: () => {
    const [localColumns] = useState(columns);
    const smallRecords = useMemo(() => generateRecords(3), []);
    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      response({ requestId, records: smallRecords.slice(offset, offset + limit), total: smallRecords.length });
    });
     
    const handleAdd = useBound(() => window.alert('Add record'));
    return <Table columns={localColumns} unitName="person" onRequest={handleRequest} onAdd={handleAdd} />;
  },
});

export const TableWithAddLabel: Story = createStory({
  width: 700,
  height: 250,
  render: () => {
    const [localColumns] = useState(columns);
    const smallRecords = useMemo(() => generateRecords(3), []);
    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      response({ requestId, records: smallRecords.slice(offset, offset + limit), total: smallRecords.length });
    });
     
    const handleAdd = useBound(() => window.alert('Add person'));
    return (
      <Table columns={localColumns} unitName="person" onRequest={handleRequest} onAdd={handleAdd} addLabel="Add person" />
    );
  },
});

export const TableWithAddTooltip: Story = createStory({
  width: 700,
  height: 250,
  render: () => {
    const [localColumns] = useState(columns);
    const smallRecords = useMemo(() => generateRecords(3), []);
    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      response({ requestId, records: smallRecords.slice(offset, offset + limit), total: smallRecords.length });
    });
     
    const handleAdd = useBound(() => window.alert('Add'));
    return (
      <Table
        columns={localColumns}
        unitName="person"
        onRequest={handleRequest}
        onAdd={handleAdd}
        addTooltip="Click to add a new person to the table"
      />
    );
  },
});

export const TableWithSummary: Story = createStory({
  width: 700,
  height: 250,
  render: () => {
    const [localColumns] = useState(columns);
    const smallRecords = useMemo(() => generateRecords(3), []);
    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      response({ requestId, records: smallRecords.slice(offset, offset + limit), total: smallRecords.length });
    });
     
    const handleAdd = useBound(() => window.alert('Add'));
    return (
      <Table
        columns={localColumns}
        unitName="person"
        onRequest={handleRequest}
        onAdd={handleAdd}
        summary="Last synced: just now"
      />
    );
  },
});

export const TableHideRecordCount: Story = createStory({
  width: 700,
  height: 250,
  render: () => {
    const [localColumns] = useState(columns);
    const smallRecords = useMemo(() => generateRecords(3), []);
    const handleRequest = useBound<TableOnRequest<DemoRecord>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      response({ requestId, records: smallRecords.slice(offset, offset + limit), total: smallRecords.length });
    });
     
    const handleAdd = useBound(() => window.alert('Add'));
    return (
      <Table
        columns={localColumns}
        onRequest={handleRequest}
        onAdd={handleAdd}
        addLabel="Add person"
        hideRecordCount
      />
    );
  },
});

export const TableWithRequestError: Story = createStory({
  parameters: { test: { skipScreenshot: true } },
  width: 700,
  height: 250,
  render: () => {
    const [localColumns] = useState(columns);
    const handleRequest = useBound<TableOnRequest>(async () => {
      await Promise.delay(800);
      throw new Error('Failed to load records from the server');
    });
    return <Table columns={localColumns} unitName="person" onRequest={handleRequest} />;
  },
});

interface NumberedRow {
  id: string;
  name: string;
}

const numberedColumns: TableColumn<NumberedRow>[] = [{ id: 'name', field: 'name', label: 'Name', type: 'string', width: 200 }];
const numberedRows: NumberedRow[] = new Array(79).fill(0).map((_, index) => ({ id: `row-${index + 1}`, name: `Row ${index + 1}` }));

/**
 * Far more rows than fit on screen: scrolling to the bottom must reach the last one. The spacers above and below the
 * rendered window give the scroller its full height; if they shrink, the scroller only spans the rows already drawn and
 * the rest are never requested (a Vision user could not see their newest devices, sc-722).
 */
export const ScrollsToTheLastRow: Story = createStory({
  width: 600,
  height: 400,
  render: () => {
    const handleRequest = useBound<TableOnRequest<NumberedRow>>(async ({ requestId, pagination: { offset = 0, limit } }, response) => {
      response({ requestId, records: numberedRows.slice(offset, offset + limit), total: numberedRows.length });
    });
    return <Table columns={numberedColumns} unitName="row" onRequest={handleRequest} />;
  },
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByText('Row 1');
    const scroller = canvasElement.querySelector<HTMLElement>('table-rows scroller-container');
    await expect(scroller).not.toBeNull();
    // Each scroll to the bottom lets the list request the next window, so keep going until the last row is drawn.
    await waitFor(() => {
      scroller!.scrollTop = scroller!.scrollHeight;
      expect(canvas.getByText('Row 79')).toBeInTheDocument();
    }, { timeout: 5000 });
  },
});
