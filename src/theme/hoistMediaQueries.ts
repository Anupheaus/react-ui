import type { CSSObject } from 'tss-react';
import type { MapOf } from '@anupheaus/common';

const MEDIA_PREFIX = '@media';

function isMediaKey(key: string): boolean {
  return key.startsWith(MEDIA_PREFIX);
}

/**
 * Combine two @media keys into one: "@media A" and "@media B" -> "@media A and B".
 * Strips the "@media " prefix from each, joins with " and ".
 * Note: comma-separated media lists may not have exact semantics when combined with " and ".
 */
function combineMediaKeys(outer: string, inner: string): string {
  const outerCondition = outer.slice(MEDIA_PREFIX.length).trim();
  const innerCondition = inner.slice(MEDIA_PREFIX.length).trim();
  if (!outerCondition) return inner;
  if (!innerCondition) return outer;
  return `${MEDIA_PREFIX} ${outerCondition} and ${innerCondition}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep merge two CSS-like objects. Nested objects are merged recursively; leaf values are overwritten by overrides.
 */
function deepMergeCSS(base: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overrides)) {
    const baseVal = result[key];
    const overrideVal = overrides[key];
    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMergeCSS(baseVal as Record<string, unknown>, overrideVal as Record<string, unknown>);
    } else {
      result[key] = overrideVal;
    }
  }
  return result;
}

interface ProcessResult {
  cleaned: Record<string, unknown>;
  hoisted: Record<string, Record<string, unknown>>;
}

/**
 * Process a single CSS object node: remove @media keys from their nested position,
 * duplicate applicable base styles into each media block, and collect hoisted media at root.
 * Nested @media (e.g. @media A containing @media B) produces an additional combined key "@media A and B".
 */
function processNode(node: Record<string, unknown>): ProcessResult {
  const cleaned: Record<string, unknown> = {};
  const hoisted: Record<string, Record<string, unknown>> = {};

  const mediaKeys: string[] = [];
  const otherKeys: string[] = [];
  for (const key of Object.keys(node)) {
    if (isMediaKey(key)) mediaKeys.push(key);
    else otherKeys.push(key);
  }

  // Base at this level: direct primitives. Nested objects (selectors) are processed; their cleaned form goes into cleaned, their hoisted media gets wrapped by selector and merged into hoisted.
  const baseAtLevel: Record<string, unknown> = {};
  for (const key of otherKeys) {
    const value = node[key];
    if (isPlainObject(value)) {
      const { cleaned: childCleaned, hoisted: childHoisted } = processNode(value as Record<string, unknown>);
      cleaned[key] = childCleaned;
      for (const [mediaKey, content] of Object.entries(childHoisted)) {
        if (!hoisted[mediaKey]) hoisted[mediaKey] = {};
        const mediaBucket = hoisted[mediaKey] as Record<string, unknown>;
        const existing = mediaBucket[key];
        if (isPlainObject(existing) && isPlainObject(content)) {
          mediaBucket[key] = deepMergeCSS(existing as Record<string, unknown>, content as Record<string, unknown>);
        } else {
          mediaBucket[key] = content;
        }
      }
    } else {
      baseAtLevel[key] = value;
      cleaned[key] = value;
    }
  }

  // Each @media key: merge baseAtLevel into media block content, add to hoisted. If media block contains nested @media, hoist those too and create combined keys.
  for (const mediaKey of mediaKeys) {
    const mediaValue = node[mediaKey];
    if (!isPlainObject(mediaValue)) continue;
    const { cleaned: innerCleaned, hoisted: innerHoisted } = processNode(mediaValue as Record<string, unknown>);
    const mergedContent = deepMergeCSS(
      baseAtLevel,
      innerCleaned as Record<string, unknown>,
    );
    if (!hoisted[mediaKey]) hoisted[mediaKey] = {};
    hoisted[mediaKey] = deepMergeCSS(hoisted[mediaKey], mergedContent) as Record<string, unknown>;

    // Hoist nested media to root and create combined keys
    for (const [innerMediaKey, innerContent] of Object.entries(innerHoisted)) {
      if (!hoisted[innerMediaKey]) hoisted[innerMediaKey] = {};
      hoisted[innerMediaKey] = deepMergeCSS(
        hoisted[innerMediaKey],
        innerContent as Record<string, unknown>,
      ) as Record<string, unknown>;
      const combinedKey = combineMediaKeys(mediaKey, innerMediaKey);
      if (!hoisted[combinedKey]) hoisted[combinedKey] = {};
      hoisted[combinedKey] = deepMergeCSS(
        hoisted[combinedKey],
        innerContent as Record<string, unknown>,
      ) as Record<string, unknown>;
    }
  }

  return { cleaned, hoisted };
}

/**
 * Process one style value (CSSObject): return the same object with media hoisted to root and base duplicated into media blocks.
 */
function hoistMediaQueriesInCssObject(obj: CSSObject): CSSObject {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const node = obj as Record<string, unknown>;
  const { cleaned, hoisted } = processNode(node);
  // Merge hoisted media at root so the returned object has structure: { ...cleaned, '@media X': {...}, ... }
  return deepMergeCSS(cleaned, hoisted) as CSSObject;
}

/**
 * Process a full styles map (each key is a class name, each value is a CSSObject).
 * Each value is transformed so that @media blocks are hoisted to the root of that value and applicable base styles are duplicated into each media block.
 */
export function hoistMediaQueriesInStyles<T extends MapOf<CSSObject>>(styles: T): T {
  if (styles == null || typeof styles !== 'object') return styles;
  const result = {} as Record<string, CSSObject>;
  for (const [key, value] of Object.entries(styles)) {
    result[key] = hoistMediaQueriesInCssObject(value as CSSObject);
  }
  return result as T;
}
