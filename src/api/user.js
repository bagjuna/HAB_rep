import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL+'/user'

// const BASE = '/api/user'

// [GET] 특정 유저 조회 (id로)
export const getUser = async (id) => {
  console.log('BASE:', BASE)
  const res = await axios.get(`${BASE}/${id}`)
  return res.data
}

// [PATCH] 유저 일부 수정
export const patchUser = async (id, data) => {
  console.log('BASE:', BASE)

  const res = await axios.patch(`${BASE}/${id}`, data)
  return res.data
}

// [PUT] 유저 전체 수정
export const updateUser = async (id, user) => {
  console.log('BASE:', BASE)

  const res = await axios.put(`${BASE}/${id}`, user)
  return res.data
}

// [POST] 유저 추가
export const createUser = async (user) => {
  console.log('BASE:', BASE)

  const res = await axios.post(BASE, user)
  return res.data
}

// [PATCH] 닉네임 + 이메일 수정
export const updateUserProfile = async (id, { nickname, email }) => {
  console.log('BASE:', BASE)

  const res = await axios.patch(`${BASE}/${id}`, { nickname, email })
  return res.data
}

// [PATCH] 예산만 수정
export const updateBudgetMonthly = async (id, budgetMonthly) => {
  const res = await axios.patch(`${BASE}/${id}`, { budgetMonthly })
  return res.data
}

// [DELETE] 유저 삭제
export const deleteUser = async (id) => {
  const res = await axios.delete(`${BASE}/${id}`)
  return res.data
}
