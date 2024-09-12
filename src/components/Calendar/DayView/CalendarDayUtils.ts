function getOffset(date: Date, hourHeight: number, startHour: number) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  return Math.round((hours * hourHeight) + (mins * (hourHeight / 60)) - (startHour * hourHeight));
}

export const calendarDayUtils = {
  getOffset,
};
