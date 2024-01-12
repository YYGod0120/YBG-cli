import { cyan, yellow, green, blue, red } from "picocolors";
export function getRandomColor(string: string) {
  const colors = [cyan, yellow, green, blue, red];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex](string);
}
