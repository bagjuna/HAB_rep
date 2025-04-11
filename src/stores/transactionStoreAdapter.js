import { useTransactionStore } from '@/api/transaction-store'

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

const mockTransaction = {
  id: 1,
  date: '2025-04-08',
  title: '점심 식사',
  amount: 12000,
  category: 1,
  type: '지출',
}

export function useTransactionStoreAdapter() {
  const store = useTransactionStore()

  // 조회
  const getTransaction = async (id) => {
    try {
      const transaction = await store.fetchSingleTransaction(id)
      return transaction
    } catch (err) {
      console.error('transactionStoreAdapter: getTransaction 에러')
      throw err
    }
  }

  // 삭제
  const deleteTransaction = async (id, test) => {
    if (test === true) {
      throw new Error()
    }

    try {
      await store.deleteSingleTransaction(id)
    } catch (err) {
      console.error('transactionStoreAdapter: deleteTransaction 에러')
      throw err
    }
  }

  // 수정
  const editTransaction = async (id, transaction) => {
    try {
      await store.editSingleTransaction(id, transaction)
    } catch (err) {
      console.error('transactionStoreAdapter: editTransaction 에러')
      throw err
    }
  }

  // 저장
  const saveTransaction = async (transaction) => {
    try {
      return await store.saveTransaction(transaction)
    } catch (err) {
      console.error('transactionStoreAdapter: editTransaction 에러')
      throw err
    }
  }

  return {
    getTransaction,
    deleteTransaction,
    editTransaction,
    saveTransaction,
  }
}
