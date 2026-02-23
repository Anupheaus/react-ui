import { faker } from '@faker-js/faker';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createStory } from '../../Storybook/createStory';
import { InternalList } from './InternalList';
import type { ReactListItem } from '../../models';
import { useBound } from '../../hooks';
import type { ComponentProps } from 'react';

faker.seed(10121);

const staticItems = new Array(150).fill(0).map((): ReactListItem => ({
  id: faker.string.uuid(),
  text: '',
  label: <span>{faker.person.fullName()}</span>,
}));

const meta: Meta<typeof InternalList> = {
  component: InternalList,
};
export default meta;

type Story = StoryObj<typeof InternalList>;

export const Loading: Story = createStory<typeof InternalList>({
  args: {},
  width: 240,
  height: 300,
  render: () => {
    const handleRequest = useBound<Required<ComponentProps<typeof InternalList>>['onRequest']>(async () => void 0);
    return (
      <InternalList tagName="internal-list" onRequest={handleRequest} showSkeletons />
    );
  },
});

export const StaticItems: Story = createStory<typeof InternalList>({
  args: {},
  width: 240,
  height: 300,
  render: () => (
    <InternalList tagName="internal-list" items={staticItems} />
  ),
});

export const LazyLoadedItems: Story = createStory<typeof InternalList>({
  args: {},
  width: 240,
  height: 300,
  render: () => {
    const request = useBound<Required<ComponentProps<typeof InternalList>>['onRequest']>(async ({ requestId, pagination }, response) => {
      await Promise.delay(1500);
      response({
        requestId,
        items: staticItems.slice(pagination.offset, (pagination.offset ?? 0) + pagination.limit) as ReactListItem<unknown>[],
        total: staticItems.length,
      });
    });
    return (
      <InternalList tagName="internal-list" onRequest={request} showSkeletons />
    );
  },
});
