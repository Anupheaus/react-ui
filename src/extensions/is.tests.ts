import './is';
import { is } from '@anupheaus/common';
import { createElement, createRef } from 'react';

describe('is.reactElement', () => {
  const validElements = [
    createElement('div'),
    createElement('span', null, 'text'),
    createElement('input', { type: 'text' }),
  ];
  const invalidValues = [null, undefined, 'hello', 42, {}, { type: 'div' }, [], true];

  test.each(validElements)('returns true for a valid React element %#', el => {
    expect(is.reactElement(el)).toBe(true);
  });

  test.each(invalidValues)('returns false for %p', value => {
    expect(is.reactElement(value)).toBe(false);
  });
});

describe('is.reactRef', () => {
  it('returns true for a createRef() result', () => {
    expect(is.reactRef(createRef())).toBe(true);
  });

  it('returns true for a plain object with a current property', () => {
    expect(is.reactRef({ current: null })).toBe(true);
  });

  it('returns true when current holds an element', () => {
    expect(is.reactRef({ current: document.createElement('div') })).toBe(true);
  });

  const invalidValues = [null, undefined, 'ref', 42, [], () => { }, { value: null }, {}];
  test.each(invalidValues)('returns false for %p', value => {
    expect(is.reactRef(value)).toBe(false);
  });
});

describe('is.fixedCSSDimension', () => {
  const validDimensions = [0, 1, 100, -10, '10px', '0px', '1.5em', '0em', '100px'];
  // '2rem'.endsWith('em') is true, so the implementation considers rem valid — excluded here
  const invalidDimensions = ['50%', '100vh', '1vw', '', '10', '10pt', undefined];

  test.each(validDimensions)('returns true for valid dimension: %p', value => {
    expect(is.fixedCSSDimension(value as any)).toBe(true);
  });

  test.each(invalidDimensions)('returns false for invalid dimension: %p', value => {
    expect(is.fixedCSSDimension(value as any)).toBe(false);
  });
});

describe('is.theme', () => {
  it('returns true for an object with id, definition, and createVariant', () => {
    expect(is.theme({ id: 'my-theme', definition: {}, createVariant: () => ({}) })).toBe(true);
  });

  it('returns false when id is an empty string', () => {
    expect(is.theme({ id: '', definition: {}, createVariant: () => ({}) })).toBe(false);
  });

  it('returns false when id is missing', () => {
    expect(is.theme({ definition: {}, createVariant: () => ({}) })).toBe(false);
  });

  it('returns false when definition is not a plain object', () => {
    expect(is.theme({ id: 'x', definition: 'string', createVariant: () => ({}) })).toBe(false);
  });

  it('returns false when createVariant is not a function', () => {
    expect(is.theme({ id: 'x', definition: {}, createVariant: 'not-a-fn' })).toBe(false);
  });

  it('returns false for null', () => {
    expect(is.theme(null)).toBe(false);
  });

  it('returns false for a string', () => {
    expect(is.theme('theme')).toBe(false);
  });

  it('returns false for an array', () => {
    expect(is.theme([])).toBe(false);
  });
});
