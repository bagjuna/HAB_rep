import { defineStore } from 'pinia'
import { getUser, patchUser, updateUser as putUser } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    budgetMonthly: (state) => state.user?.budgetMonthly || 0,
    nickname: (state) => state.user?.nickname || '',
    email: (state) => state.user?.email || '',
  },

  actions: {
    async fetchUser(id) {
      if (!id) {
        console.error('사용자 ID가 없습니다. fetchUser(id)를 호출해주세요.')
        return
      }

      this.isLoading = true
      try {
        const user = await getUser(id)
        this.user = user
      } catch (err) {
        this.error = err
        console.error('유저 정보 가져오기 실패:', err)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ 전체 정보 업데이트 (PUT)
    async updateUser(data) {
      try {
        const updated = await putUser(data.id, data)
        this.user = updated
      } catch (err) {
        this.error = err
        console.error('유저 전체 업데이트 실패:', err)
      }
    },

    // ✅ 월 예산만 업데이트 (PATCH)
    async updateBudget(amount) {
      if (!this.user) return
      try {
        const updated = await patchUser(this.user.id, {
          budgetMonthly: amount,
        })
        this.user = updated
      } catch (err) {
        this.error = err
        console.error('예산 업데이트 실패:', err)
      }
    },

    // ✅ 닉네임만 업데이트 (PATCH)
    async updateNickname(nickname) {
      if (!this.user) return
      try {
        const updated = await patchUser(this.user.id, {
          nickname,
        })
        this.user = updated
      } catch (err) {
        this.error = err
        console.error('닉네임 업데이트 실패:', err)
      }
    },

    // ✅ 거래 내역 초기화 (전체 삭제)
    async resetUserData() {
      try {
        await resetTransactions()
        console.log('거래 내역이 초기화되었습니다.')
      } catch (err) {
        this.error = err
        console.error('거래 내역 초기화 실패:', err)
      }
    },
  },
})
