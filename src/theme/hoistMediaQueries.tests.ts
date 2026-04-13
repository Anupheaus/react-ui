import { hoistMediaQueriesInStyles } from './hoistMediaQueries';

describe('hoistMediaQueriesInStyles', () => {
  it('rootMediaDuplicatesBase: base styles are duplicated into root-level @media block', () => {
    const input = {
      styleA: {
        color: 'red',
        '@media (max-width: 768px)': {
          fontSize: 12,
        },
      },
    };
    const result = hoistMediaQueriesInStyles(input);
    expect(result.styleA).toHaveProperty('color', 'red');
    expect(result.styleA).toHaveProperty('@media (max-width: 768px)');
    const mediaBlock = (result.styleA as Record<string, unknown>)['@media (max-width: 768px)'] as Record<string, unknown>;
    expect(mediaBlock).toEqual({ color: 'red', fontSize: 12 });
  });

  it('selectorNestedMediaHoistsToRoot: media inside selector is hoisted and wrapped with selector path', () => {
    const input = {
      styleA: {
        '&.foo': {
          padding: 4,
          '@media (pointer: coarse)': {
            padding: 8,
          },
        },
      },
    };
    const result = hoistMediaQueriesInStyles(input);
    const root = result.styleA as Record<string, unknown>;
    expect(root['&.foo']).toEqual({ padding: 4 });
    expect(root['@media (pointer: coarse)']).toEqual({
      '&.foo': { padding: 4, padding: 8 },
    });
  });

  it('nestedMediaCombines: @media A containing @media B produces A, B, and A and B hoisted', () => {
    const input = {
      styleA: {
        '@media (min-width: 600px)': {
          color: 'red',
          '@media (pointer: coarse)': {
            fontSize: 12,
          },
        },
      },
    };
    const result = hoistMediaQueriesInStyles(input);
    const root = result.styleA as Record<string, unknown>;
    expect(root['@media (min-width: 600px)']).toEqual({ color: 'red' });
    expect(root['@media (pointer: coarse)']).toEqual({ color: 'red', fontSize: 12 });
    expect(root['@media (min-width: 600px) and (pointer: coarse)']).toEqual({ color: 'red', fontSize: 12 });
  });

  it('nonMediaAtRulesUntouched: pseudo/selector keys are not hoisted or changed', () => {
    const input = {
      styleA: {
        color: 'blue',
        '&:hover': { color: 'navy' },
        '&.is-read-only': { opacity: 0.7 },
        '@media (max-width: 400px)': { padding: 8 },
      },
    };
    const result = hoistMediaQueriesInStyles(input);
    const root = result.styleA as Record<string, unknown>;
    expect(root.color).toBe('blue');
    expect(root['&:hover']).toEqual({ color: 'navy' });
    expect(root['&.is-read-only']).toEqual({ opacity: 0.7 });
    const mediaBlock = root['@media (max-width: 400px)'] as Record<string, unknown>;
    expect(mediaBlock).toEqual({ color: 'blue', padding: 8 });
  });

  it('handles empty or null styles', () => {
    expect(hoistMediaQueriesInStyles({})).toEqual({});
    expect(hoistMediaQueriesInStyles({ styleA: {} })).toEqual({ styleA: {} });
  });

  it('preserves multiple style keys and hoists per-key', () => {
    const input = {
      button: { color: 'red', '@media X': { fontSize: 14 } },
      label: { padding: 4, '@media Y': { padding: 8 } },
    };
    const result = hoistMediaQueriesInStyles(input);
    expect((result.button as Record<string, unknown>)['@media X']).toEqual({ color: 'red', fontSize: 14 });
    expect((result.label as Record<string, unknown>)['@media Y']).toEqual({ padding: 4, padding: 8 });
  });

  it('merges multiple occurrences of the same media query into one hoisted block', () => {
    const input = {
      styleA: {
        color: 'red',
        '@media X': { fontSize: 12 },
        '&.foo': {
          padding: 4,
          '@media X': { padding: 8 },
        },
      },
    };
    const result = hoistMediaQueriesInStyles(input);
    const root = result.styleA as Record<string, unknown>;
    expect(root['@media X']).toEqual({
      color: 'red',
      fontSize: 12,
      '&.foo': { padding: 4, padding: 8 },
    });
  });
});
