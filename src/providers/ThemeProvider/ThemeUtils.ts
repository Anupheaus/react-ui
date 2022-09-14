import { is } from 'anux-common';

const ignoredValueKeywords = ['weight', 'opacity'];

function convertValueToString(value: string | number | unknown, styleName: string) {
  if (is.number(value) && !ignoredValueKeywords.some(keyword => styleName.toLowerCase().includes(keyword))) return `${value}px`;
  return value;
}

export const ThemeUtils = {
  convertValueToString,
};