import { createStories } from '../../Storybook';
import { Grid } from './Grid';
import { GridColumnType } from './GridModels';
import { faker } from '@faker-js/faker';

const columns: GridColumnType<typeof records[number]>[] = [
  { id: '1', label: 'Name', renderValue: ({ record }) => record.name },
  { id: '2', label: 'Age **', renderValue: ({ record }) => record.age },
  { id: '3', label: 'Email', renderValue: ({ record }) => record.email },
  { id: '4', label: 'Phone', renderValue: ({ record }) => record.phone },
  { id: '5', label: 'Address', renderValue: ({ record }) => record.address },
];

faker.seed(10121);
faker.setLocale('en_GB');

const records = new Array(100).fill(0).map(() => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  age: faker.random.numeric(2),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: faker.address.streetAddress(),
}));


createStories(({ createStory }) => ({
  name: 'Components/Table',
  module,
  stories: {
    'Default': createStory({
      width: 500,
      height: 200,
      component: () => {
        return (
          <Grid
            columns={columns}
            records={records}
          />
        );
      },
    }),
  },
}));