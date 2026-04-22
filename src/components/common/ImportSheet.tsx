import { useRef, useState } from 'react'
import BottomSheet from './BottomSheet'
import { parseTimelineJSON } from '../../utils/parseTimeline'
import type { PlaceItem } from '../../utils/parseTimeline'
import { cleanPlaceName } from '../../utils/claude'

interface Props {
  targetDate: Date
  onImport: (places: PlaceItem[]) => void
  onClose: () => void
}

const MIN_DURATION = 30 // 기본 최소 머문 시간(분)

export default function ImportSheet({ targetDate, onImport, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [places, setPlaces] = useState<PlaceItem[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [parsed, setParsed] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        const items = parseTimelineJSON(json, targetDate).filter(
          (p) => p.durationMin >= MIN_DURATION
        )
        // setPlaces(items)
        // setSelected(new Set(items.map((p) => p.id)))
        setParsed(true)
        // AI 장소명 정리
const cleaned = await Promise.all(
  items.map(async (p) => ({
    ...p,
    place: await cleanPlaceName(p.place),
  }))
)
setPlaces(cleaned)
setSelected(new Set(cleaned.map((p) => p.id)))

        if (items.length === 0) setError('해당 날짜에 30분 이상 머문 장소가 없습니다.')
      } catch {
        setError('파일을 읽을 수 없습니다. Timeline.json 파일인지 확인해주세요.')
      }
    }
    reader.readAsText(file)
  }

  const toggle = (id: string) => {
  setSelected((prev) => {
    const next = new Set(prev)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    return next
  })
}

  return (
    <BottomSheet onClose={onClose}>
      {(close) => (
        <>
          {/* 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 10px' }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>오늘 방문한 장소</span>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#B4B2A9', lineHeight: 1 }}>✕</button>
          </div>

          {/* 안내 */}
          <div style={{ fontSize: 11, color: '#B4B2A9', padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D3D1C7', flexShrink: 0, display: 'inline-block' }} />
            30분 이상 머문 장소만 표시됩니다
          </div>

          {/* 파일 선택 버튼 */}
          {!parsed && (
            <div style={{ padding: '0 20px 16px' }}>
              <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display: 'none' }} />
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  width: '100%', padding: 12, borderRadius: 10,
                  background: '#EEEDFE', border: '0.5px solid #AFA9EC',
                  color: '#534AB7', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Timeline.json 파일 선택
              </button>
              {error && <p style={{ fontSize: 12, color: '#D85A30', marginTop: 8, textAlign: 'center' }}>{error}</p>}
            </div>
          )}

          {/* 장소 목록 */}
          {parsed && places.length > 0 && (
            <>
              <div style={{ padding: '0 20px', maxHeight: 320, overflowY: 'auto' }}>
                {places.map((p) => {
                  const isOn = selected.has(p.id)
                  return (
                    <div key={p.id}
                      onClick={() => toggle(p.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid #F1EFE8', cursor: 'pointer' }}
                    >
                      {/* 체크박스 */}
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        border: `1.5px solid ${isOn ? '#5A50C8' : '#CECBF6'}`,
                        background: isOn ? '#5A50C8' : '#FFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isOn && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: isOn ? '#1A1A1A' : '#B4B2A9' }}>{p.place}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <span style={{ fontSize: 11, color: '#888780' }}>{p.startTime} – {p.endTime}</span>
                          <span style={{ fontSize: 10, color: '#B4B2A9', background: '#F1EFE8', borderRadius: 4, padding: '1px 6px' }}>
                            {p.durationMin >= 60
                              ? `${Math.floor(p.durationMin / 60)}시간 ${p.durationMin % 60 > 0 ? `${p.durationMin % 60}분` : ''}`
                              : `${p.durationMin}분`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 추가 버튼 */}
              <div style={{ padding: '14px 20px 0', borderTop: '0.5px solid #F1EFE8' }}>
                <button
                  onClick={() => {
                    onImport(places.filter((p) => selected.has(p.id)))
                    close()
                  }}
                  style={{
                    width: '100%', padding: 13, borderRadius: 12,
                    background: '#5A50C8', border: 'none',
                    color: '#FFF', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  선택한 장소 추가하기
                </button>
                <p style={{ fontSize: 12, color: '#B4B2A9', textAlign: 'center', marginTop: 8 }}>
                  {selected.size}개 선택됨
                </p>
              </div>
            </>
          )}
        </>
      )}
    </BottomSheet>
  )
}