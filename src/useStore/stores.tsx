import { FunctionComponent } from 'react';

interface IProps {
  stores: JSX.Element[];
}

export const Stores: FunctionComponent<IProps> = ({ stores, children }) => {
  stores.reverse().forEach(storeComponent => children = React.cloneElement(storeComponent, {}, children || null));
  return (
    <>
      {children || null}
    </>
  );
};
