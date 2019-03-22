import { FunctionComponent } from 'react';
import { CustomTagContext } from './context';

interface IProps {
  prefix: string;
}

export const CustomTagPrefix: FunctionComponent<IProps> = ({ prefix, children }) => {
  return (
    <CustomTagContext.Provider value={{ prefix }}>
      {children || null}
    </CustomTagContext.Provider>
  );
};
