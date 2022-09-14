import { CSSObject, keyframes } from 'tss-react';

export function createAnimationKeyFrame() {
  return (style: CSSObject) => {
    const code = Object.entries(style).map(([key, value]) => `${key} { ${Object.entries(value as object).map(([propKey, propValue]) => `${propKey}: ${propValue}; `).join('')} }`).join(' ');
    return keyframes`${code}`;
  };
}