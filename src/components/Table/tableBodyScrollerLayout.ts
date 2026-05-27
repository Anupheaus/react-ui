/**
 * Table body scrollers inherit shared Scroller styles with `scrollbar-gutter: stable`.
 * That reserves a vertical gutter even when no thumb is shown. Pinned row actions align to
 * the scrollport edge, so the phantom gutter makes sticky actions drift while columns are
 * resized (the gutter disappears once horizontal overflow adds a horizontal scrollbar).
 * Override to `auto` on the table body scroller only — see Table AGENTS.md.
 */
export const TABLE_BODY_SCROLLER_SCROLLBAR_GUTTER = 'auto' as const;

export const TABLE_BODY_SCROLLER_GUTTER_OVERRIDE = {
  '& scroller-container': {
    scrollbarGutter: TABLE_BODY_SCROLLER_SCROLLBAR_GUTTER,
  },
} as const;
