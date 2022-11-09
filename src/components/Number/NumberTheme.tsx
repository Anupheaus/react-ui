import { FiPlus, FiMinus } from 'react-icons/fi';
import { createTheme } from '../../theme';
import { InternalTextTheme } from '../InternalText';

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
