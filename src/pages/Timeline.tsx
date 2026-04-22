import { useState } from 'react'

const DUMMY_PLACES = [
  {
    id: 1,
    time: '09:30',
    endTime: '11:00',
    place: '스타벅스 강남점',
    address: '서울시 강남구 테헤란로 123',
    memo: '아침 미팅. 새로운 프로젝트 기획안 논의했음. 분위기 좋았고 아이디어도 많이 나왔다.',
    expense: 8500,
    hasPhoto: true,
    recorded: true,
  },
  {
    id: 2,
    time: '12:45',
    endTime: '13:30',
    place: '청담동 파스타집',
    address: '서울시 강남구 청담동 45',
    memo: '동료들과 점심. 크림 파스타 맛있었음.',
    expense: 18000,
    hasPhoto: true,
    recorded: true,
  },
  {
    id: 3,
    time: '14:10',
    endTime: '14:45',
    place: '코엑스몰',
    address: '',
    memo: '',
    expense: 0,
    hasPhoto: false,
    recorded: false,
  },
  {
    id: 4,
    time: '15:20',
    endTime: '17:00',
    place: '코엑스 도서관',
    address: '서울시 강남구 영동대로 513',
    memo: '독서 시간. 조용하고 집중하기 좋은 환경.',
    expense: 0,
    hasPhoto: false,
    recorded: true,
  },
]

function formatDate(date: Date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDay(date: Date) {
  return date.toLocaleDateString('ko-KR', { weekday: 'long' })
}

function formatDuration(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  const h = Math.floor(diff / 60)
  const m = diff % 60
  if (h > 0 && m > 0) return `${h}시간 ${m}분`
  if (h > 0) return `${h}시간`
  return `${m}분`
}

export default function Timeline() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 17))

  const prevDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 1)
    setCurrentDate(d)
  }

  const nextDay = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 1)
    setCurrentDate(d)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8F7F2' }}>

      {/* 날짜 헤더 */}
      <div style={{
        background: '#F8F7F2', padding: '8px 20px 14px',
        borderBottom: '0.5px solid #EDECE8', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={prevDay} style={{
            width: 32, height: 32, borderRadius: '50%', background: '#EDECE8',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#5A50C8" strokeWidth={2} strokeLinecap="round">
              <polyline points="9,2 4,7 9,12" />
            </svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', letterSpacing: -0.3 }}>
              {formatDate(currentDate)}
            </div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>
              {formatDay(currentDate)}
            </div>
          </div>
          <button onClick={nextDay} style={{
            width: 32, height: 32, borderRadius: '50%', background: '#EDECE8',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#5A50C8" strokeWidth={2} strokeLinecap="round">
              <polyline points="5,2 10,7 5,12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 임포트 버튼 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#EEEDFE', border: '0.5px solid #AFA9EC',
        borderRadius: 8, padding: '7px 14px', margin: '10px 16px 2px', cursor: 'pointer',
      }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#534AB7" strokeWidth={2} strokeLinecap="round">
          <path d="M7 1v7M4 5.5l3 3 3-3" />
          <path d="M1 9.5v1a2 2 0 002 2h8a2 2 0 002-2v-1" />
        </svg>
        <span style={{ fontSize: 12, color: '#534AB7', fontWeight: 500 }}>구글 타임라인 가져오기</span>
      </div>

      {/* 타임라인 목록 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 90px' }}>
        {DUMMY_PLACES.map((item, index) => {
          const isLast = index === DUMMY_PLACES.length - 1
          const duration = formatDuration(item.time, item.endTime)

          if (!item.recorded) {
            return (
              <div key={item.id} style={{ display: 'flex' }}>
                {/* 레일 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0, marginRight: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D3D1C7', flexShrink: 0, marginTop: 4 }} />
                  {!isLast && (
                    <div style={{
                      width: 1.5, flex: 1, minHeight: 16,
                      backgroundImage: 'repeating-linear-gradient(to bottom, #CECBF6 0, #CECBF6 3px, transparent 3px, transparent 7px)',
                    }} />
                  )}
                </div>
                {/* 미기록 콘텐츠 */}
                <div style={{ flex: 1, paddingBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#C8C6C0' }}>{item.time}</span>
                    <span style={{ fontSize: 13, color: '#D3D1C7' }}>·</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#C8C6C0' }}>{item.place}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#D3D1C7' }}>탭하여 기록 추가하기</div>
                </div>
              </div>
            )
          }

          return (
            <div key={item.id} style={{ display: 'flex' }}>
              {/* 레일 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0, marginRight: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5A50C8', flexShrink: 0, marginTop: 4 }} />
                {!isLast && (
                  <div style={{ width: 1.5, flex: 1, minHeight: 16, background: '#CECBF6' }} />
                )}
              </div>
              {/* 콘텐츠 */}
              <div style={{ flex: 1, paddingBottom: 24, minWidth: 0, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', letterSpacing: -0.3 }}>{item.time}</span>
                  <span style={{ fontSize: 13, color: '#D3D1C7' }}>·</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', letterSpacing: -0.3 }}>{item.place}</span>
                </div>
                {item.address && (
                  <div style={{ fontSize: 11, color: '#B4B2A9', marginBottom: 8 }}>{item.address}</div>
                )}
                {item.hasPhoto && (
                  <div style={{
                    width: '100%', height: 120, background: '#EDECE8', borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                  }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C8C6C0" strokeWidth={1.2}>
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                  </div>
                )}
                {item.memo && (
                  <p style={{ fontSize: 13, color: '#444441', lineHeight: 1.65, marginBottom: 8 }}>{item.memo}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#C8C6C0' }}>
                    {item.time} – {item.endTime} · {duration}
                  </span>
                  {item.expense > 0 ? (
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#D85A30' }}>
                      − {item.expense.toLocaleString()}원
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: '#D3D1C7' }}>지출 없음</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}