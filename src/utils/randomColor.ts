import pkg from "picocolors";
const { cyan, yellow, green, red, blue } = pkg;
export function getRandomColor(string: string) {
  const colors = [cyan, yellow, green, red, blue];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex](string);
}
