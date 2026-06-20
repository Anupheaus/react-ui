import { createStyles } from '../../theme';

if (typeof CSS !== 'undefined' && 'registerProperty' in CSS) {
  try {
    (CSS as any).registerProperty({ name: '--scrollbar-thumb-color', syntax: '<color>', inherits: true, initialValue: 'transparent' });
  } catch { /* already registered */ }
}

export const useScrollbarStyles = createStyles(({ scrollbars: { thumb, track } }, { applyTransition }) => ({
  scrollbars: {
    overflow: 'overlay',
    '--scrollbar-thumb-color': 'transparent' as unknown as undefined,
    ...applyTransition('--scrollbar-thumb-color'),

    '&.is-scrollbar-visible': {
      '--scrollbar-thumb-color': (thumb.normal.backgroundColor ?? 'rgba(0 0 0 / 10%)') as unknown as undefined,
    },

    '@media(pointer: coarse)': {
      '--scrollbar-thumb-color': (thumb.normal.backgroundColor ?? 'rgba(0 0 0 / 10%)') as unknown as undefined,
    },

    '&::-webkit-scrollbar': {
      ...track.normal,
      padding: 0,
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track': {
      ...track.normal,
      padding: 0,
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-track-piece:vertical:start': {
      marginTop: track.normal.paddingTop ?? track.normal.padding ?? 0,
    },
    '&::-webkit-scrollbar-track-piece:vertical:corner-present:end': {
      marginBottom: track.normal.paddingBottom ?? track.normal.padding ?? 0,
    },
    '&::-webkit-scrollbar-track-piece:horizontal:start': {
      marginLeft: track.normal.paddingLeft ?? track.normal.padding ?? 0,
    },
    '&::-webkit-scrollbar-track-piece:horizontal:corner-present:end': {
      marginRight: track.normal.paddingRight ?? track.normal.padding ?? 0,
    },
    '&::-webkit-scrollbar-track-piece': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 8,
      minHeight: 40,
      ...thumb.normal,
      backgroundColor: 'var(--scrollbar-thumb-color)',
      boxShadow: 'none',
      border: 'solid 0px transparent',
      borderWidth: track.normal.padding ?? 4,
      backgroundClip: 'padding-box',
    },
  },
}));