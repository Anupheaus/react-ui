import { createStyles } from '../../theme';

export const useScrollbarStyles = createStyles(({ scrollbars: { thumb, track } }, { applyTransition }) => ({
  scrollbars: {
    overflow: 'overlay',
    backgroundColor: 'rgba(0 0 0 / 0%)',
    backgroundClip: 'text',
    ...applyTransition('background-color'),

    '&.is-scrollbar-visible': {
      backgroundColor: thumb.normal.backgroundColor ?? 'rgba(0 0 0 / 10%)',
    },

    '@media(pointer: coarse)': {
      backgroundColor: thumb.normal.backgroundColor ?? 'rgba(0 0 0 / 10%)',
    },

    '&::-webkit-scrollbar': {
      ...track.normal,
      padding: 0,
    },
    '&::-webkit-scrollbar-track': {
      ...track.normal,
      padding: 0,
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
    '&::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      borderRadius: 8,
      minHeight: 40,
      ...thumb.normal,
      backgroundColor: 'inherit',
      boxShadow: 'none',
      border: 'solid 0px transparent',
      borderWidth: track.normal.padding ?? 4,
      backgroundClip: 'padding-box',
    },
  },
}));