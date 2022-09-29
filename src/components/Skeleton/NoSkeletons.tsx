import { pureFC } from '../../anuxComponents';
import { SkeletonContexts } from './SkeletonContexts';

export const NoSkeletons = pureFC()('NoSkeletons', ({
  children = null,
}) => (
  <SkeletonContexts.noSkeletons.Provider value={true}>
    {children}
  </SkeletonContexts.noSkeletons.Provider>
));
