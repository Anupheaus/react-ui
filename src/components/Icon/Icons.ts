import {
  FiAlertCircle, FiCheck, FiChevronRight, FiColumns, FiHelpCircle, FiImage, FiMaximize, FiMinimize, FiMinus, FiPlus, FiRefreshCw, FiX,
  FiEye, FiEyeOff,
} from 'react-icons/fi';
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
  'password-show': FiEye,
  'password-hide': FiEyeOff,

} satisfies { [key: string]: IconType; };

export type IconName = keyof typeof IconDefinitions;

export function configureIcons(icons: { [key: string]: IconType; }): void {
  Object.assign(IconDefinitions, icons);
}
