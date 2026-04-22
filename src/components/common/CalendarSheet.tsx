import { useState } from 'react'
import BottomSheet from './BottomSheet'

interface Props {
  currentDate: Date
  onSelect: (date: Date) => void
  onClose: () => void
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarSheet({ currentDate, onSelect, onClose }: Props) {
  const [viewDate, setViewDate] = useState(new Date(currentDate))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ]

  const isSelected = (day: number) =>
    currentDate.getFullYear() === year &&
    currentDate.getMonth() === month &&
    currentDate.getDate() === day

  const isToday = (day: number) => {
    const t = new Date()
    return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day
  }

  return (
    <BottomSheet onClose={onClose}>
      {(close) => (
        <>
          {/* 월 네비게이션 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#5A50C8" strokeWidth={2} strokeLinecap="round">
                <polyline points="9,2 4,7 9,12" />
              </svg>
            </button>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{year}년 {month + 1}월</span>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#5A50C8" strokeWidth={2} strokeLinecap="round">
                <polyline points="5,2 10,7 5,12" />
              </svg>
            </button>
          </div>

          {/* 요일 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 16px', marginBottom: 4 }}>
            {DAYS.map((d, i) => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 600, padding: '4px 0',
                color: i === 0 ? '#D85A30' : i === 6 ? '#5A50C8' : '#B4B2A9',
              }}>{d}</div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 16px', gap: '2px 0' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const col = i % 7
              const selected = isSelected(day)
              const today = isToday(day)
              return (
                <button key={i}
                  onClick={() => {
                    onSelect(new Date(year, month, day))
                    close() // ← handleClose 호출로 애니메이션 포함
                  }}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: '50%', border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: selected ? 600 : 400,
                    background: selected ? '#5A50C8' : 'transparent',
                    color: selected ? '#FFF' : today ? '#5A50C8' : col === 0 ? '#D85A30' : col === 6 ? '#5A50C8' : '#1A1A1A',
                    outline: today && !selected ? '1.5px solid #CECBF6' : 'none',
                  }}>
                  {day}
                </button>
              )
            })}
          </div>
        </>
      )}
    </BottomSheet>
  )
}