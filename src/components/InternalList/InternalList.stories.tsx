import { faker } from '@faker-js/faker';
import { Meta, StoryObj } from '@storybook/react';
import { createStory } from '../../Storybook';
import { InternalList } from './InternalList';
import { ReactListItem } from '../../models';
import { useBound } from '../../hooks';
import { ComponentProps } from 'react';
import { MockListItem } from './MockListItem';

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

type Story = StoryObj<typeof InternalList>;

export const Loading: Story = createStory<typeof InternalList>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    const handleRequest = useBound(() => void 0);

    return (
      <InternalList tagName="internal-list" onRequest={handleRequest}>
        <MockListItem />
      </InternalList>
    );
  },
});

export const StaticItems: Story = createStory<typeof InternalList>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    return (
      <InternalList tagName="internal-list" items={staticItems}>
        <MockListItem />
      </InternalList>
    );
  },
});

export const LazyLoadedItems: Story = createStory<typeof InternalList>({
  args: {

  },
  width: 240,
  height: 300,
  render: () => {
    const request = useBound<Required<ComponentProps<typeof InternalList>>['onRequest']>(async ({ requestId, pagination }, response) => {
      await Promise.delay(1500);
      response({
        requestId,
        items: staticItems.slice(pagination.offset, (pagination.offset ?? 0) + pagination.limit),
        total: staticItems.length,
      });
    });

    return (
      <InternalList tagName="internal-list" onRequest={request}>
        <MockListItem />
      </InternalList>
    );
  },
});
