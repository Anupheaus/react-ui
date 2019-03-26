const draggingData: any[] = [];

export function setDraggingData(data: any[]): void {
  draggingData.length = 0;
  if (data instanceof Array) { draggingData.push(...data); }
}

export function retrieveDraggingData(): any[] {
  return draggingData.slice();
}
