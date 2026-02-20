export const todayISO = () => new Date().toISOString().slice(0, 10);

export const startOfWeekISO = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export const formatJP = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}月${d}日`;
};
