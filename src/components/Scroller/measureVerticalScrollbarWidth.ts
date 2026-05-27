/** Width reserved by a vertical scrollbar on a scroll container (0 when no vertical overflow). */
export function measureVerticalScrollbarWidth(element: HTMLDivElement): number {
  if (element.scrollHeight <= element.clientHeight + 1) return 0;
  return Math.max(0, element.offsetWidth - element.clientWidth);
}
