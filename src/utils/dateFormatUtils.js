/**
 * YYYYMMDD (숫자 또는 문자열) → YYYY-MM-DD 형식으로 변환
 * @param {string|number} intDate
 * @returns {string}
 */
export function formatDateToDashed(intDate) {
  const str = intDate.toString()

  if (!/^\d{8}$/.test(str)) {
    throw new Error('잘못된 날짜 형식입니다. 예: 20240401')
  }

  const year = str.slice(0, 4)
  const month = str.slice(4, 6)
  const day = str.slice(6, 8)

  return `${year}-${month}-${day}`
}

/**
 * YYYY-MM-DD 문자열 → YYYYMMDD 형식의 숫자로 변환
 * @param {string} dashedDate
 * @returns {number}
 */
export function formatDateToInt(dashedDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dashedDate)) {
    throw new Error('잘못된 날짜 형식입니다. 예: 2024-04-01')
  }

  return parseInt(dashedDate.replace(/-/g, ''))
}
