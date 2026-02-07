import { FaBaby, FaUmbrellaBeach } from 'react-icons/fa';
import {
  FiAlertCircle, FiCheck, FiChevronRight, FiColumns, FiHelpCircle, FiImage, FiMaximize, FiMinimize, FiMinus, FiPlus, FiRefreshCw, FiX,
  FiEye, FiEyeOff, FiChevronDown, FiLock, FiCalendar, FiEdit2, FiMoreVertical, FiUser, FiCopy, FiArrowUp, FiArrowDown,
  FiSliders, FiMail, FiPhone, FiTrash2,
  FiChevronLeft
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
  'edit': FiEdit2,
  'ellipsis-menu': FiMoreVertical,
  'chip-delete': FiX,
  'user': FiUser,
  'copy': FiCopy,
  'arrow-up': FiArrowUp,
  'arrow-down': FiArrowDown,
  'filters': FiSliders,
  'email': FiMail,
  'phone': FiPhone,
  'delete-list-item': FiTrash2,
  'go-back': FiChevronLeft,
} satisfies IconDefinitions;

export type IconName = keyof typeof LocalIconDefinitions;
