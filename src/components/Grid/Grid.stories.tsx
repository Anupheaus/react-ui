import { createStories } from '../../Storybook';
import { Grid, GridColumns, GridRecords } from '.';
import { GridColumn } from './GridModels';
import { faker } from '@faker-js/faker';
import { generateUIStateStories } from '../../providers/UIStateProvider/UIStateProvider.stories.utils';
import { Flex } from '../Flex';
import { Skeleton } from '../Skeleton';
import { useBound, useUpdatableState } from '../../hooks';

interface DemoRecord {
  id: string;
  name: string;
  age: string;
  email: string;
  phone: string;
  address: string;
}

const columns: GridColumn<DemoRecord>[] = [
  { id: '1', field: 'name', label: 'Name', renderValue: ({ record }) => <Skeleton variant={'text'}>{record?.name ?? 'Loading...'}</Skeleton> },
  { id: '2', field: 'age', label: 'Age **', renderValue: ({ record }) => <Skeleton variant={'text'}>{record?.age ?? 'Loading...'}</Skeleton> },
  { id: '3', field: 'email', label: 'Email', renderValue: ({ record }) => <Skeleton variant={'text'}>{record?.email ?? 'Loading...'}</Skeleton> },
  { id: '4', field: 'phone', label: 'Phone', renderValue: ({ record }) => <Skeleton variant={'text'}>{record?.phone ?? 'Loading...'}</Skeleton> },
  { id: '5', field: 'address', label: 'Address', renderValue: ({ record }) => <Skeleton variant={'text'}>{record?.address ?? 'Loading...'}</Skeleton> },
];

faker.seed(10121);
faker.setLocale('en_GB');

const records: DemoRecord[] = new Array(100).fill(0).map(() => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  age: faker.random.numeric(2),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.address.streetAddress(),
}));

const DemoableGrid = () => (
  <Flex height={300}>
    <Grid columns={columns} />
  </Flex>);

createStories(({ createStory }) => ({
  name: 'Components/Grid',
  module,
  stories: {
    ...generateUIStateStories(DemoableGrid),
    'Default': createStory({
      width: 500,
      height: 200,
      component: () => {
        const [localColumns, setLocalColumns] = useUpdatableState(() => columns, [4444]);
        const refresh = useBound(() => {
          /* do nothing */
        });

        return (
          <Grid columns={localColumns} records={records} />
        );
      },
    }),
  },
}));