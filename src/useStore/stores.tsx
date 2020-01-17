import { FunctionComponent } from 'react';
import { IMap, is } from 'anux-common';
import { IProvider } from './provider';

interface IProps {
  stores: (JSX.Element | IProvider<IMap, IMap>)[];
}

export const Stores: FunctionComponent<IProps> = ({ stores, children }) => {
  stores.reverse().forEach(StoreComponent => children =
    is.function(StoreComponent) ? <StoreComponent>{children}</StoreComponent> : React.cloneElement(StoreComponent, {}, children || null));
  return (
    <>
      {children || null}
    </>
  );
};
