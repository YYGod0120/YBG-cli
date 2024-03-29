import dayjs from "dayjs";

export function UTCToString(date: string): string {
  return dayjs(date).format("YYYY-MM-DD");
}

export const currentDate = dayjs().format("YYYY-MM-DD");
