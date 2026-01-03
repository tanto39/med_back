export const formatDateForDB = (dateStr?: string) => {
  if (dateStr) {
    const dateTm: string = dateStr + "T21:00:00.000Z";
    const d = new Date(dateTm);
    return d.toLocaleDateString();
  }
  return dateStr;
};
