import { AnyObject } from '@anupheaus/common';
import { ReactNode, createContext, memo, useContext } from 'react';

interface Props {
  children?: ReactNode;
}

export function createComponentOverrides() {

  const Context = createContext<AnyObject>({});

  const overrideProps = (props: AnyObject) => {
    const overridingProps = useContext(Context);
    return {
      ...props,
      ...overridingProps,
    };
  };

  const Overrides = memo<Props>(({
    children,
    ...props
  }) => {
    return (
      <Context.Provider value={props}>
        {children}
      </Context.Provider>
    );
  });

  return {
    Overrides,
    overrideProps,
  };
}