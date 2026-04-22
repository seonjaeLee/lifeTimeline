import { useState } from 'react'
import BottomSheet from './BottomSheet'
import TimePicker from './TimePicker'

interface Props {
  onAdd: (place: { place: string; startTime: string; endTime: string; memo: string }) => void
  onClose: () => void
}

export default function AddPlaceSheet({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [memo, setMemo] = useState('')
  const [memoLen, setMemoLen] = useState(0)

  const labelStyle = {
    fontSize: 11, fontWeight: 600, color: '#B4B2A9',
    letterSpacing: '0.06em', marginBottom: 6, display: 'block',
  }

  return (
    <BottomSheet onClose={onClose}>
      {(close) => (
        <>
          {/* 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 16px' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>장소 직접 추가</span>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#B4B2A9', lineHeight: 1 }}>✕</button>
          </div>

          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* 장소명 */}
            <div>
              <label style={labelStyle}>장소명</label>
              <input
                placeholder="예) 스타벅스 강남점"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%', background: '#FFFFFF', border: '1.5px solid #EDECE8',
                  borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#1A1A1A',
                  fontFamily: 'Pretendard, sans-serif', boxSizing: 'border-box', outline: 'none',
                }}
              />
            </div>

            {/* 방문 시간 */}
            <div>
              <label style={labelStyle}>방문 시간</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <TimePicker value={startTime} onChange={setStartTime} />
                </div>
                <span style={{ color: '#D3D1C7', flexShrink: 0, fontSize: 16 }}>–</span>
                <div style={{ flex: 1 }}>
                  <TimePicker value={endTime} onChange={setEndTime} />
                </div>
              </div>
            </div>

            {/* 메모 */}
            <div>
              <label style={labelStyle}>메모 (선택)</label>
              <div style={{ position: 'relative', background: '#FFFFFF', border: '1.5px solid #EDECE8', borderRadius: 10, padding: '11px 14px 28px' }}>
                <textarea
                  maxLength={100}
                  placeholder="간단한 메모를 남겨보세요"
                  value={memo}
                  onChange={(e) => { setMemo(e.target.value); setMemoLen(e.target.value.length) }}
                  style={{
                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 14, color: '#1A1A1A', fontFamily: 'Pretendard, sans-serif',
                    resize: 'none', height: 64, lineHeight: 1.7,
                  }}
                />
                <span style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: '#C8C6C0' }}>
                  {memoLen}/100
                </span>
              </div>
            </div>

          </div>

          {/* 추가 버튼 */}
          <div style={{ padding: '20px 20px 0' }}>
            <button
              onClick={() => {
                if (!name.trim()) return
                onAdd({ place: name.trim(), startTime, endTime, memo })
                close()
              }}
              style={{
                width: '100%', padding: 13, borderRadius: 12,
                background: name.trim() ? '#5A50C8' : '#D3D1C7',
                border: 'none', color: '#FFF', fontSize: 14,
                fontWeight: 600, cursor: name.trim() ? 'pointer' : 'default',
                fontFamily: 'Pretendard, sans-serif',
              }}
            >
              추가하기
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  )
}