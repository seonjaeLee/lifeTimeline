import { useNavigate, useParams } from 'react-router-dom'

// 임시 더미 데이터 (나중에 전역 state 또는 DB로 교체)
const DUMMY_PLACES = [
  { id: '1', time: '09:30', endTime: '11:00', place: '스타벅스 강남점', address: '서울시 강남구 테헤란로 123', memo: '아침 미팅. 새로운 프로젝트 기획안 논의했음. 분위기 좋았고 아이디어도 많이 나왔다.', expense: 8500 },
  { id: '2', time: '12:45', endTime: '13:30', place: '청담동 파스타집', address: '서울시 강남구 청담동 45', memo: '동료들과 점심. 크림 파스타 맛있었음.', expense: 18000 },
  { id: '3', time: '14:10', endTime: '14:45', place: '코엑스몰', address: '', memo: '', expense: 0 },
  { id: '4', time: '15:20', endTime: '17:00', place: '코엑스 도서관', address: '서울시 강남구 영동대로 513', memo: '독서 시간. 조용하고 집중하기 좋은 환경.', expense: 0 },
]

const MOODS = ['😊', '😍', '😐', '😔', '😤']

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

export default function PlaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const place = DUMMY_PLACES.find((p) => p.id === id)

  if (!place) return (
    <div style={{ padding: 20, color: '#888' }}>장소를 찾을 수 없습니다.</div>
  )

  const duration = formatDuration(place.time, place.endTime)

  const secLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: '#B4B2A9',
    letterSpacing: '0.06em', marginBottom: 8, display: 'block',
  }
  const divider = <div style={{ height: 0.5, background: '#EDECE8', margin: '14px 0' }} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8F7F2' }}>

      {/* 헤더 */}
      <div style={{ background: '#F8F7F2', padding: '8px 20px 14px', borderBottom: '0.5px solid #EDECE8', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#B4B2A9', lineHeight: 1, padding: 0 }}
          >
            ←
          </button>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', letterSpacing: -0.4 }}>{place.place}</span>
        </div>
        <div style={{ fontSize: 12, color: '#888780' }}>
          {place.time} – {place.endTime} &nbsp;·&nbsp; {place.address || '주소 없음'} &nbsp;·&nbsp; {duration}
        </div>
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 90px' }}>

        {/* 사진 */}
        <div>
          <span style={secLabel}>사진</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 72, height: 72, borderRadius: 10, background: '#EDECE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8C6C0" strokeWidth={1.2}>
                <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 10, background: '#EDECE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8C6C0" strokeWidth={1.2}>
                <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
            <div style={{ width: 72, height: 72, borderRadius: 10, border: '1.5px dashed #D3D1C7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3D1C7" strokeWidth={2} strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
          </div>
        </div>

        {divider}

        {/* 기분 */}
        <div>
          <span style={secLabel}>기분</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {MOODS.map((mood, i) => (
              <div key={i} style={{
                width: 38, height: 38, borderRadius: '50%',
                border: `1.5px solid ${i === 0 ? '#5A50C8' : '#EDECE8'}`,
                background: i === 0 ? '#EEEDFE' : '#FFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, cursor: 'pointer',
              }}>
                {mood}
              </div>
            ))}
          </div>
        </div>

        {divider}

        {/* 메모 */}
        <div>
          <span style={secLabel}>메모</span>
          <div style={{ background: '#FFF', border: '0.5px solid #EDECE8', borderRadius: 12, padding: 12, minHeight: 100, fontSize: 14, color: '#444441', lineHeight: 1.75 }}>
            {place.memo || <span style={{ color: '#D3D1C7' }}>이 장소에서의 기록을 남겨보세요</span>}
          </div>
        </div>

        {divider}

        {/* 지출 */}
        <div>
          <span style={secLabel}>지출</span>
          {place.expense > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F1EFE8' }}>
              <div>
                <div style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 500 }}>지출 내역</div>
                <div style={{ fontSize: 11, color: '#B4B2A9' }}>기타</div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#D85A30' }}>− {place.expense.toLocaleString()}원</span>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: '#D3D1C7', padding: '8px 0' }}>지출 내역이 없습니다</div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 0', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A50C8" strokeWidth={2} strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span style={{ fontSize: 13, color: '#5A50C8', fontWeight: 500 }}>지출 추가</span>
          </div>
        </div>

      </div>
    </div>
  )
}