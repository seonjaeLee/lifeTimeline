import { useRef, useEffect } from 'react'

interface Props {
  value: string // "HH:MM"
  onChange: (value: string) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const ITEM_H = 44

function ScrollColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[]
  selected: string
  onSelect: (v: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  // 선택값 → 스크롤 위치 동기화
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const idx = items.indexOf(selected)
    el.scrollTop = idx * ITEM_H
  }, [selected, items])

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    const idx = Math.round(el.scrollTop / ITEM_H)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    if (items[clamped] !== selected) onSelect(items[clamped])
  }

  return (
    <div style={{ position: 'relative', width: 64, flexShrink: 0 }}>
      {/* 선택 영역 하이라이트 */}
<div style={{
  position: 'absolute', top: '50%', left: 0, right: 0,
  height: ITEM_H, transform: 'translateY(-50%)',
  background: '#F1EFE8', borderRadius: 8, pointerEvents: 'none', zIndex: 0,
}} />
      {/* 위아래 페이드 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to bottom, #FFFFFF, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(to top, #FFFFFF, transparent)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* 스크롤 영역 */}
      <div
  ref={ref}
  onScroll={onScroll}
  style={{
    height: ITEM_H * 5,
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    scrollbarWidth: 'none',
    position: 'relative', zIndex: 1,
  }}
>
        <style>{`div::-webkit-scrollbar{display:none}`}</style>

        {/* 상단 패딩 */}
        <div style={{ height: ITEM_H * 2 }} />

        {items.map((v) => (
          <div
            key={v}
            onClick={() => onSelect(v)}
            style={{
              height: ITEM_H,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: v === selected ? 600 : 400,
              color: v === selected ? '#1A1A1A' : '#C8C6C0',
              scrollSnapAlign: 'center',
              cursor: 'pointer',
              transition: 'color 0.15s, font-weight 0.15s',
            }}
          >
            {v}
          </div>
        ))}

        {/* 하단 패딩 */}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  )
}

export default function TimePicker({ value, onChange }: Props) {
  const [h, m] = value.split(':')

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 8, background: '#FFFFFF', border: '1.5px solid #EDECE8',
      borderRadius: 10, padding: '0 16px',
    }}>
      <ScrollColumn
        items={HOURS}
        selected={h}
        onSelect={(v) => onChange(`${v}:${m}`)}
      />
      <span style={{ fontSize: 20, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>:</span>
      <ScrollColumn
        items={MINUTES}
        selected={m}
        onSelect={(v) => onChange(`${h}:${v}`)}
      />
    </div>
  )
}