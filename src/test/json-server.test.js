import axios from "axios";
import { test, expect } from "vitest";

const BASE_URL = import.meta.env.VITE_API_URL

test('유저 목록을 받는다', async () => {
    const response = await axios.get(`${API_BASE}/user`)
    expect(response.status).toBe(200)
    expect(response.data[0]).toHaveProperty('nickname', '홍길동')
})

test('카테고리를 모두 가져온다', async () => {
    const response = await axios.get(`${API_BASE}/category`)
    expect(response.status).toBe(200)
    expect(response.data.length).toBe(3)
  })

test('거래 내역 중 하나의 상세 정보를 확인한다', async () => {
const response = await axios.get(`${API_BASE}/transactions/1`)
expect(response.status).toBe(200)
expect(response.data).toMatchObject({
    title: '점심 식사',
    amount: 8000,
    type: 'EXPENDITURE'
})
})
