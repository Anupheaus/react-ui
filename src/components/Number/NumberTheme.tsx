import { InternalTextTheme } from '../InternalText';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { createTheme } from '../../theme';

export const NumberTheme = createTheme({
  id: 'NumberTheme',
  definition: {
    ...InternalTextTheme.definition,
  },
  icons: {
    increase: FiPlus,
    decrease: FiMinus,
  },
});
