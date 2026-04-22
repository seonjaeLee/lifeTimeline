import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const DUMMY_EXPENSES = [
  { id: '1', date: '2026-04-22', place: '스타벅스 강남점', category: '식비', amount: 8500, type: 'expense' as const },
  { id: '2', date: '2026-04-22', place: '청담동 파스타집', category: '식비', amount: 18000, type: 'expense' as const },
  { id: '3', date: '2026-04-21', place: '이디야커피 역삼점', category: '식비', amount: 4300, type: 'expense' as const },
  { id: '4', date: '2026-04-21', place: '강남 맛집', category: '식비', amount: 32500, type: 'expense' as const },
  { id: '5', date: '2026-04-21', place: 'GS25 편의점', category: '식비', amount: 9000, type: 'expense' as const },
  { id: '6', date: '2026-04-20', place: '지하철', category: '교통', amount: 1400, type: 'expense' as const },
  { id: '7', date: '2026-04-20', place: '올리브영', category: '쇼핑', amount: 35000, type: 'expense' as const },
  { id: '8', date: '2026-04-19', place: '용돈', category: '수입', amount: 100000, type: 'income' as const },
]

const CATEGORY_COLORS: Record<string, string> = {
  식비: '#D85A30',
  교통: '#5A50C8',
  쇼핑: '#1D9E75',
  숙박: '#EF9F27',
  의료: '#E24B4A',
  문화: '#378ADD',
  수입: '#639922',
  기타: '#888780',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
}

function formatMonth(date: Date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
}

export default function Finance() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  // 해당 월 데이터 필터
  const monthStr = currentDate.toLocaleDateString('sv-SE').slice(0, 7)
  const monthData = DUMMY_EXPENSES.filter((e) => e.date.startsWith(monthStr))

  const totalExpense = monthData.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
  const totalIncome = monthData.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0)
  const expenseCount = monthData.filter((e) => e.type === 'expense').length
  const incomeCount = monthData.filter((e) => e.type === 'income').length

  // 카테고리별 집계
  const categoryMap: Record<string, number> = {}
  monthData.filter((e) => e.type === 'expense').forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] ?? 0) + e.amount
  })
  const chartData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  // 날짜별 그룹
  const dateMap: Record<string, typeof DUMMY_EXPENSES> = {}
  monthData.forEach((e) => {
    if (!dateMap[e.date]) dateMap[e.date] = []
    dateMap[e.date].push(e)
  })
  const sortedDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8F7F2' }}>

      {/* 월 헤더 */}
      <div style={{ background: '#F8F7F2', padding: '8px 20px 14px', borderBottom: '0.5px solid #EDECE8', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDECE8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round"><polyline points="9,2 4,7 9,12" /></svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>{formatMonth(currentDate)}</span>
          <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDECE8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#1A1A1A" strokeWidth={2} strokeLinecap="round"><polyline points="5,2 10,7 5,12" /></svg>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 90px' }}>

        {/* 요약 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#FFF', border: '0.5px solid #EDECE8', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#888780', fontWeight: 500 }}>총 지출</span>
              <span style={{ fontSize: 10, color: '#C8C6C0' }}>{expenseCount}건</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#D85A30', letterSpacing: -0.5, display: 'block', textAlign: 'right' }}>
              {totalExpense.toLocaleString()}원
            </span>
          </div>
          <div style={{ background: '#FFF', border: '0.5px solid #EDECE8', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#888780', fontWeight: 500 }}>총 수입</span>
              <span style={{ fontSize: 10, color: '#C8C6C0' }}>{incomeCount}건</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#1D9E75', letterSpacing: -0.5, display: 'block', textAlign: 'right' }}>
              {totalIncome.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 도넛 차트 */}
        {chartData.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 120, height: 120, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#888780'} />
                    ))}
                  </Pie>
                 <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}원`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              {chartData.map((entry) => (
                <div key={entry.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[entry.name] ?? '#888780', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#444441' }}>{entry.name}</span>
                    <span style={{ fontSize: 11, color: '#B4B2A9' }}>{Math.round(entry.value / totalExpense * 100)}%</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#1A1A1A', fontWeight: 500 }}>{entry.value.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 구분선 */}
        <div style={{ height: 0.5, background: '#EDECE8', marginBottom: 12 }} />

        {/* 날짜별 내역 */}
        {sortedDates.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#D3D1C7', fontSize: 13, padding: '40px 0' }}>이번 달 내역이 없습니다</div>
        ) : (
          sortedDates.map((date) => {
            const items = dateMap[date]
            const dayTotal = items.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
            return (
              <div key={date} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EDECE8', borderRadius: 8, padding: '6px 12px', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#5F5E5A' }}>{formatDate(date)}</span>
                  {dayTotal > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: '#D85A30' }}>− {dayTotal.toLocaleString()}원</span>}
                </div>
                {items.map((e) => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 12px' }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 500 }}>{e.place}</div>
                      <div style={{ fontSize: 11, color: '#B4B2A9' }}>{e.category}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: e.type === 'expense' ? '#D85A30' : '#1D9E75' }}>
                      {e.type === 'expense' ? '−' : '+'} {e.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            )
          })
        )}

      </div>
    </div>
  )
}