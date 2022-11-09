import { ReactNode } from 'react';
import { createComponent } from '../Component';
import { SkeletonContexts } from './SkeletonContexts';

interface Props {
  children?: ReactNode;
}

export const NoSkeletons = createComponent({
  id: 'NoSkeletons',

  render: ({
    children = null,
  }: Props) => (
    <SkeletonContexts.noSkeletons.Provider value={true}>
      {children}
    </SkeletonContexts.noSkeletons.Provider>
  ),
});
