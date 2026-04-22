import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  onClose: () => void
  children: ReactNode | ((close: () => void) => ReactNode)
}

export default function BottomSheet({ onClose, children }: Props) {
  const [visible, setVisible] = useState(false)
  const [dragY, setDragY] = useState(0)
  const dragStartY = useRef<number | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    setDragY(0)
    setTimeout(onClose, 240)
  }

  const onDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    dragStartY.current = y
  }

  const onDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY.current === null) return
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    const delta = y - dragStartY.current
    if (delta > 0) setDragY(delta)
  }

  const onDragEnd = () => {
    if (dragY > 80) handleClose()
    else setDragY(0)
    dragStartY.current = null
  }

  const isDragging = dragY > 0
  const sheetTransform = !visible
    ? 'translateY(100%)'
    : dragY > 0 ? `translateY(${dragY}px)` : 'translateY(0)'

  return (
    <>
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.35)',
        opacity: visible ? Math.max(0, 1 - dragY / 300) : 0,
        transition: isDragging ? 'none' : 'opacity 0.24s ease',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#FFF', borderRadius: '24px 24px 0 0',
        zIndex: 201, paddingBottom: 32,
        transform: sheetTransform,
        transition: isDragging ? 'none' : 'transform 0.24s ease',
      }}>
        <div
          onMouseDown={onDragStart} onMouseMove={onDragMove}
          onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
          onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}
          style={{ padding: '12px 0 8px', cursor: 'grab', touchAction: 'none' }}
        >
          <div style={{ width: 36, height: 4, background: '#EDECE8', borderRadius: 2, margin: '0 auto' }} />
        </div>

        {/* handleClose를 children에 전달 */}
        {typeof children === 'function' ? children(handleClose) : children}
      </div>
    </>
  )
}