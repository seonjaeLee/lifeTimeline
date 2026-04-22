import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { classifyCategory } from '../../utils/claude'

interface Props {
  onSave: (expense: { amount: number; category: string; memo: string; type: 'expense' | 'income' }) => void
  onClose: () => void
}

const CATEGORIES = [
  { icon: '☕', label: '식비' },
  { icon: '🚌', label: '교통' },
  { icon: '🛍', label: '쇼핑' },
  { icon: '🏨', label: '숙박' },
  { icon: '💊', label: '의료' },
  { icon: '🎬', label: '문화' },
  { icon: '💰', label: '수입' },
  { icon: '📦', label: '기타' },
]


export default function ExpenseSheet({ onSave, onClose }: Props) {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('식비')
  const [memo, setMemo] = useState('')
  const [memoLen, setMemoLen] = useState(0)
  const [isClassifying, setIsClassifying] = useState(false)

  return (
    <BottomSheet onClose={onClose}>
      {(close) => (
        <>
          {/* 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>지출 추가</span>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#B4B2A9', lineHeight: 1 }}>✕</button>
          </div>

          {/* 지출/수입 탭 */}
          <div style={{ display: 'flex', margin: '0 20px', background: '#F1EFE8', borderRadius: 10, padding: 3 }}>
            {(['expense', 'income'] as const).map((t) => (
              <div
                key={t}
                onClick={() => setType(t)}
                style={{
                  flex: 1, padding: '8px 0', textAlign: 'center',
                  fontSize: 13, fontWeight: 600, borderRadius: 8, cursor: 'pointer',
                  background: type === t ? '#FFF' : 'transparent',
                  color: type === t ? (t === 'expense' ? '#D85A30' : '#1D9E75') : '#B4B2A9',
                  transition: 'all 0.15s',
                }}
              >
                {t === 'expense' ? '지출' : '수입'}
              </div>
            ))}
          </div>

          {/* 금액 입력 */}
<div style={{ padding: '16px 20px 0', textAlign: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
    <span style={{ fontSize: 24, fontWeight: 600, color: '#C8C6C0' }}>₩</span>
    <input
      type="text"
      inputMode="numeric"
      value={amount ? Number(amount).toLocaleString() : ''}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9]/g, '')
        setAmount(raw)
      }}
      onKeyDown={(e) => {
        if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
          e.preventDefault()
        }
      }}
      placeholder="0"
      style={{
        fontSize: 40, fontWeight: 700, color: '#1A1A1A', letterSpacing: -1,
        border: 'none', outline: 'none', background: 'transparent',
        textAlign: 'center', width: 200, fontFamily: 'Pretendard, sans-serif',
      }}
    />
  </div>
</div>

          {/* 카테고리 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '14px 20px 0' }}>
            {CATEGORIES.map((c) => (
              <div
                key={c.label}
                onClick={() => setCategory(c.label)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 2px', borderRadius: 10,
                  border: `1.5px solid ${category === c.label ? '#5A50C8' : '#EDECE8'}`,
                  background: category === c.label ? '#EEEDFE' : '#FFF',
                  cursor: 'pointer', fontSize: 20,
                  transition: 'all 0.15s',
                }}
              >
                <span>{c.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: category === c.label ? '#5A50C8' : '#444441' }}>{c.label}</span>
              </div>
            ))}
          </div>

          {/* 메모 */}
          <div style={{ padding: '12px 20px 0' }}>
            <div style={{ position: 'relative', background: '#F8F7F2', border: '1.5px solid #EDECE8', borderRadius: 10, padding: '11px 14px 28px' }}>
              <textarea
                maxLength={100}
                placeholder="간단한 메모를 남겨보세요"
                value={memo}
                onChange={(e) => { setMemo(e.target.value); setMemoLen(e.target.value.length) }}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  fontSize: 14, color: '#1A1A1A', fontFamily: 'Pretendard, sans-serif',
                  resize: 'none', height: 56, lineHeight: 1.7,
                }}
              />
              <span style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: '#C8C6C0' }}>{memoLen}/100</span>
            </div>
          </div>

        {/* AI 카테고리 자동 분류 버튼 */}
{amount && Number(amount) > 0 && (
  <div style={{ padding: '8px 20px 0' }}>
    <button
      onClick={async () => {
        setIsClassifying(true)
        const result = await classifyCategory('장소', Number(amount))
        setCategory(result)
        setIsClassifying(false)
      }}
      style={{
        width: '100%', padding: 10, borderRadius: 10,
        background: '#EEEDFE', border: '0.5px solid #AFA9EC',
        color: '#534AB7', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {isClassifying ? 'AI 분류 중...' : '✦ AI로 카테고리 자동 분류'}
    </button>
  </div>
)}

          {/* 저장 버튼 */}
          <div style={{ padding: '12px 20px 0' }}>
            <button
              onClick={() => {
                const num = Number(amount)
                if (!amount || num === 0) return
                onSave({ amount: num, category, memo, type })
                close()
              }}
              style={{
                width: '100%', padding: 13, borderRadius: 12,
                background: amount && Number(amount) > 0 ? '#5A50C8' : '#D3D1C7',
                border: 'none', color: '#FFF', fontSize: 14, fontWeight: 600,
                cursor: amount && Number(amount) > 0 ? 'pointer' : 'default',
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              저장
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  )
}