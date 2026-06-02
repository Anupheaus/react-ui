interface ContentFieldNormal {
  borderColor?: string;
}

export function getCalendarGridLineColor(normal: ContentFieldNormal): string {
  return normal.borderColor ?? 'rgba(0 0 0 / 10%)';
}
