import { useState } from 'react'
import { DEFAULT_SETTINGS } from '../utils/settings'
import type { AppSettings } from '../utils/settings'

const Toggle = ({ on }: { on: boolean }) => (
  <div style={{ width: 42, height: 24, borderRadius: 12, background: on ? '#5A50C8' : '#D3D1C7', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#FFF', position: 'absolute', top: 2, right: on ? 2 : 20, transition: 'right 0.2s' }} />
  </div>
)

const AiBadge = () => (
  <span style={{ fontSize: 10, fontWeight: 600, color: '#5A50C8', background: '#EEEDFE', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>AI</span>
)

const RowIcon = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
  <div style={{ width: 28, height: 28, borderRadius: 7, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {children}
  </div>
)

const secLabel = { fontSize: 11, fontWeight: 600, color: '#B4B2A9', letterSpacing: '0.06em', padding: '0 20px', marginBottom: 6, display: 'block' } as const
const secCard = { background: '#FFF', borderTop: '0.5px solid #EDECE8', borderBottom: '0.5px solid #EDECE8' } as const
const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: '0.5px solid #F1EFE8', cursor: 'pointer' } as const
const chevron = <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#C8C6C0" strokeWidth={2} strokeLinecap="round"><polyline points="5,2 10,7 5,12"/></svg>

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  const toggle = (key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8F7F2' }}>
      <div style={{ background: '#F8F7F2', padding: '8px 20px 16px', borderBottom: '0.5px solid #EDECE8', flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', letterSpacing: -0.4 }}>설정</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0 90px' }}>

        {/* AI 비서 */}
        <div style={{ marginBottom: 8 }}>
          <span style={secLabel}>AI 비서</span>
          <div style={secCard}>
            <div style={row} onClick={() => toggle('aiPlaceClean')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RowIcon bg="#1D9E75">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={1.8} strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </RowIcon>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>장소명 자동 정리</span>
                    <AiBadge />
                  </div>
                  <div style={{ fontSize: 11, color: '#B4B2A9', marginTop: 2 }}>임포트 시 장소명을 간결하게 변환</div>
                </div>
              </div>
              <Toggle on={settings.aiPlaceClean} />
            </div>
            <div style={row} onClick={() => toggle('aiCategoryAuto')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RowIcon bg="#EF9F27">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={1.8} strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </RowIcon>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>지출 카테고리 자동 분류</span>
                    <AiBadge />
                  </div>
                  <div style={{ fontSize: 11, color: '#B4B2A9', marginTop: 2 }}>장소명으로 카테고리 자동 선택</div>
                </div>
              </div>
              <Toggle on={settings.aiCategoryAuto} />
            </div>
            <div style={{ ...row, borderBottom: 'none' }} onClick={() => toggle('aiDaySummary')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RowIcon bg="#5A50C8">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={1.8} strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>
                </RowIcon>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>하루 한 줄 요약</span>
                    <AiBadge />
                  </div>
                  <div style={{ fontSize: 11, color: '#B4B2A9', marginTop: 2 }}>타임라인 상단에 하루 요약 표시</div>
                </div>
              </div>
              <Toggle on={settings.aiDaySummary} />
            </div>
          </div>
        </div>

        {/* 위치 */}
        <div style={{ marginBottom: 8 }}>
          <span style={secLabel}>위치</span>
          <div style={secCard}>
            <div style={{ ...row, borderBottom: 'none', cursor: 'default' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>최소 머문 시간</div>
                <div style={{ fontSize: 11, color: '#B4B2A9', marginTop: 2 }}>이 시간 이상 머문 장소만 표시</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#B4B2A9' }}>30분</span>
                {chevron}
              </div>
            </div>
          </div>
        </div>

        {/* 출납 */}
        <div style={{ marginBottom: 8 }}>
          <span style={secLabel}>출납</span>
          <div style={secCard}>
            <div style={row}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>기본 통화</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#B4B2A9' }}>🇰🇷 대한민국 KRW</span>
                {chevron}
              </div>
            </div>
            <div style={{ ...row, borderBottom: 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>카테고리 관리</span>
              {chevron}
            </div>
          </div>
        </div>

        {/* 백업 */}
        <div style={{ marginBottom: 8 }}>
          <span style={secLabel}>백업</span>
          <div style={secCard}>
            <div style={{ ...row, borderBottom: 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>구글 드라이브 연결</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, color: '#B4B2A9' }}>미연결</span>
                {chevron}
              </div>
            </div>
          </div>
        </div>

        {/* 앱 정보 */}
        <div>
          <span style={secLabel}>앱 정보</span>
          <div style={secCard}>
            <div style={{ ...row, borderBottom: 'none', cursor: 'default' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>버전</span>
              <span style={{ fontSize: 13, color: '#B4B2A9' }}>0.1.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}