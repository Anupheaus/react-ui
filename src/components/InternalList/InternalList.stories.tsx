import { faker } from '@faker-js/faker';
import { Meta } from '@storybook/react';
import { createStory } from '../../Storybook';
import { InternalList } from './InternalList';
import { ReactListItem } from '../../models';
import { DataPagination } from '@anupheaus/common';
import { useBound } from '../../hooks';
import { ComponentProps } from 'react';
import { ListOnRequest } from '../List';

faker.seed(10121);

const staticItems = new Array(150).fill(0).map((): ReactListItem => {
  return {
    id: faker.string.uuid(),
    text: '',
    label: <span>{faker.person.fullName()}</span>,
  };
});

const meta: Meta<typeof InternalList> = {
  component: InternalList,
};
export default meta;

export const Loading = createStory<typeof InternalList>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    const handleRequest = useBound<ListOnRequest>(async () => {
      return new Promise(() => void 0);
    });

    return (
      <InternalList tagName="internal-list" onRequest={handleRequest} />
    );
  },
});

export const StaticItems = createStory<typeof InternalList>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    return (
      <InternalList tagName="internal-list" items={staticItems} />
    );
  },
});

export const LazyLoadedItems = createStory<typeof InternalList>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    const request = useBound<Required<ComponentProps<typeof InternalList>>['onRequest']>(async (pagination: DataPagination) => {
      await Promise.delay(1500);
      return {
        items: staticItems.slice(pagination.offset, (pagination.offset ?? 0) + pagination.limit),
        total: staticItems.length,
        offset: 0,
        ...pagination,
      };
    });
    return (
      <InternalList tagName="internal-list" onRequest={request} />
    );
  },
});
