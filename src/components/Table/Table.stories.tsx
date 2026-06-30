import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
import { Table } from './Table';
import type { TableColumn, TableOnRequest } from './TableModels';
import { faker } from '@faker-js/faker';
import { useBound } from '../../hooks';
import { useMemo, useState } from 'react';
import { to } from '@anupheaus/common';
import { DefaultTheme, ThemeProvider } from '../../theme';

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

// Empty-message helpers mirror those used in Table.tests.tsx so the stories exercise the same data-source behaviour.
const emptyMessageColumns: TableColumn<DemoRecord>[] = [
  { id: '1', field: 'name', label: 'Name', type: 'string', width: 150 },
  { id: '2', field: 'email', label: 'Email', type: 'string', width: 200 },
];

const emptyTableRequest: TableOnRequest<DemoRecord> = async ({ requestId }, response) => {
  response({ requestId, records: [], total: 0 });
};

const populatedTableRequest: TableOnRequest<DemoRecord> = async ({ requestId, pagination: { offset = 0, limit } }, response) => {
  const populatedRecords = generateRecords(2);
  response({
    requestId,
    records: populatedRecords.slice(offset, offset + limit),
    total: populatedRecords.length,
  });
};

const pendingTableRequest: TableOnRequest<DemoRecord> = () => new Promise<void>(() => void 0);

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

export const EmptyMessageDefault: Story = createStory({
  width: 700,
  height: 300,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Table columns={emptyMessageColumns} onRequest={emptyTableRequest} />
    </ThemeProvider>
  ),
});

export const EmptyMessageCustomString: Story = createStory({
  width: 700,
  height: 300,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Table columns={emptyMessageColumns} onRequest={emptyTableRequest} emptyMessage="Nothing here yet" />
    </ThemeProvider>
  ),
});

export const EmptyMessageReactElement: Story = createStory({
  width: 700,
  height: 300,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Table columns={emptyMessageColumns} onRequest={emptyTableRequest} emptyMessage={<span data-testid="custom-empty">Custom empty content</span>} />
    </ThemeProvider>
  ),
});

export const EmptyMessageSuppressed: Story = createStory({
  width: 700,
  height: 300,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Table columns={emptyMessageColumns} onRequest={emptyTableRequest} emptyMessage={null} />
    </ThemeProvider>
  ),
});

export const EmptyMessagePopulated: Story = createStory({
  width: 700,
  height: 300,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Table columns={emptyMessageColumns} onRequest={populatedTableRequest} emptyMessage="Nothing here yet" />
    </ThemeProvider>
  ),
});

export const EmptyMessageLoading: Story = createStory({
  width: 700,
  height: 300,
  render: () => (
    <ThemeProvider theme={DefaultTheme}>
      <Table columns={emptyMessageColumns} onRequest={pendingTableRequest} emptyMessage="Nothing here yet" />
    </ThemeProvider>
  ),
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-alert
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
    // eslint-disable-next-line no-alert
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
    // eslint-disable-next-line no-alert
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
    // eslint-disable-next-line no-alert
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
    // eslint-disable-next-line no-alert
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
