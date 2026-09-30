export function time(minutes: number) {
  return `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
}
export function dateTime(value: string) {
  return new Date(value).toLocaleString('zh-TW');
}
