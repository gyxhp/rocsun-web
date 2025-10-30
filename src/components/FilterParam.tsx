/**
 * 过滤对象中值为空的属性（undefined、null、空字符串）
 * @param obj 原始对象
 * @returns 过滤后的对象
 */
function filterEmptyParams<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    // 排除 undefined、null、空字符串（可根据需求调整判断条件）
    if (value !== undefined && value !== null && value !== '') {
      result[key as keyof T] = value;
    }
  }
  return result;
}

export default filterEmptyParams;
