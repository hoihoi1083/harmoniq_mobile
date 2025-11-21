import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROOM_TYPES_LABEL_CN, ROOM_TYPES_LABEL_TW } from "@/types/room";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBirthDate(birthDateTime: string) {
  const date = new Date(birthDateTime);
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    day: date.getDate().toString().padStart(2, "0"),
    hour: date.getHours().toString().padStart(2, "0"),
  };
}export function splitLongString(longString: string, maxLength: number) {
  const result = [];
  let startIndex = 0;

  while (startIndex < longString.length) {
    let endIndex = startIndex + maxLength;
    if (endIndex > longString.length) {
      endIndex = longString.length;
    }
    result.push(longString.substring(startIndex, endIndex));
    startIndex = endIndex;
  }

  return result;
}

export function getRoomLabel(roomId: string, locale: string) {
  const roomType = roomId.split("-")[0];
  const no = roomId.split("-")[1];
  if (locale === "zh-CN") {
    return ROOM_TYPES_LABEL_CN[roomType] + "-" + no;
  }
  return ROOM_TYPES_LABEL_TW[roomType] + "-" + no;
}
