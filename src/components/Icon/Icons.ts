import { FiAlertCircle, FiCheck, FiChevronRight, FiColumns, FiHelpCircle, FiImage, FiMaximize, FiMinimize, FiMinus, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi';
import { IconType } from '../../theme';

export const IconDefinitions = {
  'drawer-close': FiX,
  'dialog-close': FiX,
  'window-close': FiX,
  'window-maximize': FiMaximize,
  'window-restore': FiMinimize,
  'grid-column-selection': FiColumns,
  'grid-refresh': FiRefreshCw,
  'no-image': FiImage,
  'button-apply': FiCheck,
  'error': FiAlertCircle,
  'help': FiHelpCircle,
  'number-increase': FiPlus,
  'number-decrease': FiMinus,
  'sub-menu': FiChevronRight,
} satisfies { [key: string]: IconType; };

export type IconName = keyof typeof IconDefinitions;

export function configureIcons(icons: { [key: string]: IconType; }): void {
  Object.assign(IconDefinitions, icons);
}
