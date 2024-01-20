function getOffset(date: Date, hourHeight: number) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  return Math.round((hours * hourHeight) + (mins * (hourHeight / 60)));
}

export const calendarDayUtils = {
  getOffset,
};
