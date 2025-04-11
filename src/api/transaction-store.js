import { defineStore } from 'pinia'
import {
  fetchTransactions,
  fetchTransactionsByDate,
  fetchTransactionsByDateRange,
  dateToInt,
  fetchTransactionsByMonth,
  fetchTransaction,
  createTransaction,
  putTransaction,
  deleteTransaction,
} from '@/api/TransactionApi'
import { formatDateToDashed, formatDateToInt } from '@/utils/dateFormatUtils'
import { toRaw } from 'vue'

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    loading: false,
    error: null,
    filters: {
      dateRange: [],
      category_id: '',
      type: '',
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
    },
  }),

  getters: {
    filteredTransactions() {
      return this.transactions.filter((tx) => {
        // 카테고리 필터
        const matchesCategory =
          !this.filters.category_id || tx.category_id === Number(this.filters.category_id)

        // 타입 필터 (수입/지출)
        const matchesType = !this.filters.type || tx.type === this.filters.type

        // 날짜 범위 필터
        let matchesDateRange = true
        if (this.filters.dateRange && this.filters.dateRange.length === 2) {
          const txDate = parseInt(tx.date) // 문자열인 경우 숫자로 변환
          const startDate = parseInt(this.filters.dateRange[0])
          const endDate = parseInt(this.filters.dateRange[1])

          matchesDateRange = txDate >= startDate && txDate <= endDate
        }

        // 최종 필터 결과
        return matchesCategory && matchesType && matchesDateRange
      })
    },

    // 페이지네이션된 트랜잭션 목록
    paginatedTransactions() {
      const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage
      const end = start + this.pagination.itemsPerPage

      return this.filteredTransactions.slice(start, end)
    },

    // 전체 페이지 수
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.pagination.itemsPerPage) || 1
    },
  },

  actions: {
    async fetchTransactionsByMonth(year, month) {
      this.loading = true
      this.error = null

      try {
        this.transactions = await fetchTransactionsByMonth(year, month)
        this.resetPagination()
      } catch (error) {
        this.error = error.message || '거래 내역을 불러오는데 실패했습니다.'
        console.error('Failed to fetch transactions by month:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTransactionsByDateRange(startDate, endDate) {
      this.loading = true
      this.error = null

      try {
        if (startDate && endDate) {
          const startInt = dateToInt(startDate)
          const endInt = dateToInt(endDate)

          // 날짜 범위를 파라미터로 전달하여 서버에서 필터링
          const params = {
            date_gte: startInt,
            date_lte: endInt,
            _sort: 'date',
            _order: 'desc',
          }

          const response = await axios.get('api/transactions', { params })
          this.transactions = response.data
        } else {
          // 날짜 범위가 없는 경우 모든 트랜잭션 가져오기
          this.transactions = await fetchTransactions()
        }

        this.resetPagination()
      } catch (error) {
        this.error = error.message || '거래 내역을 불러오는데 실패했습니다.'
        console.error('Failed to fetch transactions by date range:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAllTransactions() {
      this.loading = true
      this.error = null

      try {
        this.transactions = await fetchTransactions()
        this.resetPagination()
      } catch (error) {
        this.error = error.message || '거래 내역을 불러오는데 실패했습니다.'
        console.error('Failed to fetch all transactions:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchRecentTransactions(limit = 5) {
      this.loading = true
      this.error = null

      try {
        const allTransactions = await fetchTransactions({
          _sort: 'date',
          _order: 'desc',
          _limit: limit,
        })

        return allTransactions
      } catch (error) {
        this.error = error.message || '최근 거래 내역을 불러오는데 실패했습니다.'
        console.error('Failed to fetch recent transactions:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    setFilter(filterType, value) {
      // 날짜 필터인 경우, Date 객체를 정수로 변환
      if (filterType === 'dateRange' && Array.isArray(value) && value.length === 2) {
        // value가 Date 객체라면 정수로 변환
        if (value[0] instanceof Date && value[1] instanceof Date) {
          this.filters[filterType] = [dateToInt(value[0]), dateToInt(value[1])]
        } else {
          this.filters[filterType] = value
        }
      } else {
        this.filters[filterType] = value
      }
      this.resetPagination()
    },

    resetFilters() {
      this.filters = {
        dateRange: [],
        category_id: '',
        type: '',
      }
      this.resetPagination()
    },

    // 페이지네이션 관련 메서드
    goToPage(pageNumber) {
      if (pageNumber > 0 && pageNumber <= this.totalPages) {
        this.pagination.currentPage = pageNumber
      }
    },

    nextPage() {
      if (this.pagination.currentPage < this.totalPages) {
        this.pagination.currentPage++
      }
    },

    prevPage() {
      if (this.pagination.currentPage > 1) {
        this.pagination.currentPage--
      }
    },

    resetPagination() {
      this.pagination.currentPage = 1
    },

    setItemsPerPage(count) {
      this.pagination.itemsPerPage = count
      this.resetPagination()
    },

    async fetchSingleTransaction(id) {
      try {
        const response = await fetchTransaction(id)
        response.date = formatDateToDashed(response.date) // 20240101 -> 2024-01-01
        return response
      } catch (err) {
        console.error('transaction-store: fetchSingleTransaction', err)
        throw err
      }
    },

    async saveTransaction(transaction) {
      try {
        const raw = { ...toRaw(transaction) }
        raw.date = formatDateToInt(raw.date)
        const response = await createTransaction(raw)
        return response
      } catch (err) {
        console.error('transaction-store: fetchSingleTransaction', err)
        throw err
      }
    },

    async editSingleTransaction(id, transaction) {
      try {
        const raw = { ...toRaw(transaction) }
        raw.date = formatDateToInt(raw.date)
        return await putTransaction(id, raw)
      } catch (err) {
        console.error('transaction-store: fetchSingleTransaction', err)
        throw err
      }
    },

    async deleteSingleTransaction(id) {
      try {
        await deleteTransaction(id)
      } catch (err) {
        console.error('transaction-store: fetchSingleTransaction', err)
        throw err
      }
    },
  },
})
