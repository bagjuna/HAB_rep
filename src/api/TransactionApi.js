import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const fetchTransactions = async (params = {}) => {
  try {
    console.log('BASE_URL:', BASE_URL)
    const response = await axios.get( BASE_URL+'/transactions', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching transactions:', error)
    throw error
  }
}

export const fetchTransaction = async (id) => {
  try {
    const response = await axios.get(BASE_URL+`/transactions/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching transaction with id ${id}:`, error)
    throw error
  }
}

// 월별 조회
export const fetchTransactionsByMonth = async (year, month) => {
  try {
    // 월의 시작일과 끝일 계산 (정수 형태)
    const startDateInt = parseInt(`${year}${String(month).padStart(2, '0')}01`)

    // 월의 마지막 날 계산
    const lastDay = new Date(year, month, 0).getDate()
    const endDateInt = parseInt(
      `${year}${String(month).padStart(2, '0')}${String(lastDay).padStart(2, '0')}`,
    )

    const params = {
      date_gte: startDateInt,
      date_lte: endDateInt,
      _sort: 'date',
      _order: 'desc',
    }

    console.log('요청 날짜 범위:', startDateInt, '~', endDateInt)

    const response = await axios.get(BASE_URL+'/transactions', { params })
    return response.data
  } catch (error) {
    console.error(`Error fetching transactions for ${year}-${month}:`, error)
    throw error
  }
}

export const fetchTransactionsByDate = async (year, month) => {
  try {
    // 월의 첫날과 다음 달 첫날을 정수로 계산
    const startDate = parseInt(`${year}${String(month).padStart(2, '0')}01`)
    const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
    const endDate = parseInt(`${nextMonth.year}${String(nextMonth.month).padStart(2, '0')}01`) - 1

    const params = {
      date_gte: startDate,
      date_lte: endDate,
      _sort: 'date',
      _order: 'desc',
    }

    console.log('요청 날짜 범위:', startDate, '~', endDate)

    const response = await axios.get(BASE_URL+'/transactions', { params })

    console.log('받은 데이터:', response.data)

    return response.data
  } catch (error) {
    console.error(`Error fetching transactions for ${year}-${month}:`, error)
    throw error
  }
}

export const fetchTransactionsByDateRange = async (startDate, endDate) => {
  try {
    // Date 객체를 yyyymmdd 정수로 변환
    const startInt = dateToInt(startDate)

    // endDate에 하루를 더하고 -1을 하지 않고, 그날의 마지막 날짜를 계산
    // 예: 20250315 -> 종료일이므로 실제로는 그날의 마지막 시간까지 포함해야 함
    const endInt = dateToInt(endDate)

    console.log('📦 요청 날짜:', startDate, endDate)
    console.log('📦 정수 변환 결과:', startInt, endInt)

    const params = {
      date_gte: startInt,
      date_lte: endInt,
      _sort: 'date',
      _order: 'desc',
    }

    const response = await axios.get(BASE_URL+'/transactions', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching transactions by date range:', error)
    throw error
  }
}

// Date 객체 -> yyyymmdd 형태의 정수 변환
export const dateToInt = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return parseInt(`${year}${month}${day}`)
}

// yyyymmdd 정수 -> Date 객체로 변환
export const intToDate = (intDate) => {
  const strDate = String(intDate)
  const year = parseInt(strDate.substring(0, 4))
  const month = parseInt(strDate.substring(4, 6)) - 1
  const day = parseInt(strDate.substring(6, 8))
  return new Date(year, month, day)
}

// 거래 생성
export const createTransaction = async (transaction) => {
  try {
    const response = await axios.post(BASE_URL+'/transactions', transaction)
    return response.data
  } catch (err) {
    console.error('TransactionApi: createTransaction', err)
    throw err
  }
}

// 거래 수정
export const putTransaction = async (id, transaction) => {
  try {
    const response = await axios.put(BASE_URL+`/transactions/${id}`, transaction)
    return response.data
  } catch (err) {
    console.error('TransactionApi: editTransaction', err)
    throw err
  }
}

// 거래 삭제
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(BASE_URL+`/transactions/${id}`)
    return response.data
  } catch (err) {
    console.error('TransactionApi: deleteTransaction', err)
    throw err
  }
}
