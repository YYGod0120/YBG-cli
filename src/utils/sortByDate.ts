export function sortByDate(array: { [x: string]: string }[]) {
  // 使用 Array.sort() 方法进行排序
  array.sort(function (a, b) {
    // 将日期字符串转换为日期对象进行比较
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    // 返回比较的结果
    return dateB - dateA;
  });

  // 返回排序后的数组
  return array;
}
