import { FaBaby, FaUmbrellaBeach } from 'react-icons/fa';
import {
  FiAlertCircle, FiCheck, FiChevronRight, FiColumns, FiHelpCircle, FiImage, FiMaximize, FiMinimize, FiMinus, FiPlus, FiRefreshCw, FiX,
  FiEye, FiEyeOff, FiChevronDown, FiLock, FiCalendar, FiEdit2, FiMoreVertical, FiUser,
} from 'react-icons/fi';
import { MdBusinessCenter, MdOutlineSick } from 'react-icons/md';
import type { IconType } from '../../theme';

export interface IconDefinitions {
  [key: string]: IconType;
}

export const LocalIconDefinitions = {
  'drawer-close': FiX,
  'dialog-close': FiX,
  'window-close': FiX,
  'window-maximize': FiMaximize,
  'window-restore': FiMinimize,
  'table-column-selection': FiColumns,
  'table-refresh': FiRefreshCw,
  'table-edit': FiEdit2,
  'no-image': FiImage,
  'button-apply': FiCheck,
  'error': FiAlertCircle,
  'help': FiHelpCircle,
  'number-increase': FiPlus,
  'number-decrease': FiMinus,
  'sub-menu': FiChevronRight,
  'password-show': FiEye,
  'password-hide': FiEyeOff,
  'dropdown': FiChevronDown,
  'sign-in-dialog': FiLock,
  'calendar-holiday': FaUmbrellaBeach,
  'calendar-business': MdBusinessCenter,
  'calendar-sick': MdOutlineSick,
  'calendar-paternity': FaBaby,
  'calendar': FiCalendar,
  'tick': FiCheck,
  'cross': FiX,
  'add': FiPlus,
  'ellipsis-menu': FiMoreVertical,
  'chip-delete': FiX,
  'user': FiUser,
} satisfies IconDefinitions;

export type IconName = keyof typeof LocalIconDefinitions;
