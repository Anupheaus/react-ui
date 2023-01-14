import { FiAlertCircle, FiCheck, FiColumns, FiImage, FiMinus, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi';
import { IconType } from '../../theme';

export const IconDefinitions = {
  'drawer-close': FiX,
  'grid-column-selection': FiColumns,
  'grid-refresh': FiRefreshCw,
  'no-image': FiImage,
  'button-apply': FiCheck,
  'error': FiAlertCircle,
  'number-increase': FiPlus,
  'number-decrease': FiMinus,
} satisfies { [key: string]: IconType; };

export type IconName = keyof typeof IconDefinitions;
