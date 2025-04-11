import { describe, expect, beforeEach, test } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBudgetStore } from '@/stores/budgetStore'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

describe('budgetStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())

    // mock user 예산
    mock.onGet('http://localhost:3000/user').reply(200, [{ budgetMonthly: 300000 }])

    // mock 이번 달 expenditure
    mock
      .onGet('http://localhost:3000/transactions', {
        params: {
          type: 'EXPENDITURE',
          date_gte: 20250401,
          date_lte: 20250430,
        },
      })
      .reply(200, [{ amount: 8000 }, { amount: 12000 }])
  })

  test('budgetStore 초기화, 남은 예산 확인', async () => {
    // given
    // 25년 4월 예산: 300,000원
    // 25년 4월 지출: 도합 20,000원 -> 남은 예산: 280,000원
    const store = useBudgetStore()

    // when
    await store.initBudget()

    // then
    expect(store.getMonthlyBudget().value).toBe(300000)
    expect(store.getRemainingBudget().value).toBe(280000)

    expect(store.getDailyRemainingBudget().value).toBe(Math.floor(280000 / 30))
    expect(store.getWeeklyRemainingBudget().value).toBe(store.getDailyRemainingBudget().value * 7)
  })
})
