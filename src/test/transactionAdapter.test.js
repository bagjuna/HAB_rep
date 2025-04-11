import { expect, test } from "vitest";
import { useTransactionStoreAdapter } from '../stores/transactionStoreAdapter'

// 조회
test('getTransaction 반환값 확인', async () => {
  const {getTransaction} = useTransactionStoreAdapter();
  const result = await getTransaction('1');
  console.log(result);
  expect(result).toBeDefined();
})

// 삭제
test('deleteTransaction 성공', async () => {
  const {deleteTransaction} = useTransactionStoreAdapter();

  try {
    await deleteTransaction('1');
    console.log('삭제 성공');
  } catch {
    console.log("삭제 실패");
  }
})

test('deleteTransaction 실패', async () => {
  const {deleteTransaction} = useTransactionStoreAdapter();

  try {
    await deleteTransaction('1', true);
    console.log('삭제 성공');
  } catch {
    console.log("삭제 실패");
  }
})

// 수정
test('editTransaction 반환값 확인', async () => {
  // given
  const editedTransaction = {
    id: 4,
    date: '2025-03-15',
    title: '술',
    amount: 150000,
    category: 4,
    type: '지출',
  }

  const {editTransaction} = useTransactionStoreAdapter();

  // when
  const result = await editTransaction('1', editedTransaction);

  // then
  console.log(result);
  expect(result).equals(editedTransaction);
})

// 저장
test('saveTransaction 반환값 확인', async () => {
  const savedTransaction = {
    id: 7,
    date: '2025-04-06',
    title: '월급',
    amount: 10000000,
    category: 16,
    type: '수입',
  }

  const {saveTransaction} = useTransactionStoreAdapter();

  const result = await saveTransaction(savedTransaction);

  console.log(result);
  expect(result).equals(savedTransaction);
})