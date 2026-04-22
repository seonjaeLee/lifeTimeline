export interface PlaceItem {
  id: string
  place: string
  address: string
  lat: number
  lng: number
  startTime: string
  endTime: string
  durationMin: number
}

// 시간 문자열 파싱 → "HH:MM" 형식
function toHHMM(iso: string): string {
  const d = new Date(iso)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

// 두 시간 사이 분 계산
function diffMin(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return (eh * 60 + em) - (sh * 60 + sm)
}

// 날짜 문자열 비교용 (YYYY-MM-DD)
function toDateStr(iso: string): string {
  return new Date(iso).toLocaleDateString('sv-SE') // sv-SE → YYYY-MM-DD
}

// 구글 타임라인 JSON 파싱
export function parseTimelineJSON(json: unknown, targetDate: Date): PlaceItem[] {
  const dateStr = targetDate.toLocaleDateString('sv-SE')
  const results: PlaceItem[] = []

  // 타입 가드
  if (!json || typeof json !== 'object') return []
  const obj = json as Record<string, unknown>

  // 구형 포맷: { timelineObjects: [...] }
  const objects = Array.isArray(obj['timelineObjects'])
    ? (obj['timelineObjects'] as unknown[])
    : []

  // 신형 포맷: { semanticSegments: [...] }
  const segments = Array.isArray(obj['semanticSegments'])
    ? (obj['semanticSegments'] as unknown[])
    : []

  const allItems = [...objects, ...segments]

  for (const item of allItems) {
    if (!item || typeof item !== 'object') continue
    const entry = item as Record<string, unknown>

    // placeVisit (구형) 또는 visit (신형)
    const visit = (entry['placeVisit'] ?? entry['visit']) as Record<string, unknown> | undefined
    if (!visit) continue

    // 시간 추출
    const duration = visit['duration'] as Record<string, unknown> | undefined
    const startRaw = (duration?.['startTimestamp'] ?? duration?.['startTimeGnssUtc'] ?? visit['startTime']) as string | undefined
    const endRaw = (duration?.['endTimestamp'] ?? duration?.['endTimeGnssUtc'] ?? visit['endTime']) as string | undefined
    if (!startRaw || !endRaw) continue

    // 날짜 필터
    if (toDateStr(startRaw) !== dateStr) continue

    // 장소명
    const location = (visit['location'] ?? visit['topCandidate']) as Record<string, unknown> | undefined
    const name = (location?.['name'] ?? location?.['placeID'] ?? '알 수 없는 장소') as string

    // 주소
    const address = (location?.['address'] ?? '') as string

    // 좌표
    const latE7 = location?.['latitudeE7'] as number | undefined
    const lngE7 = location?.['longitudeE7'] as number | undefined
    const lat = latE7 ? latE7 / 1e7 : 0
    const lng = lngE7 ? lngE7 / 1e7 : 0

    const startTime = toHHMM(startRaw)
    const endTime = toHHMM(endRaw)
    const durationMin = diffMin(startTime, endTime)

    results.push({
      id: `${startRaw}-${name}`,
      place: name,
      address,
      lat,
      lng,
      startTime,
      endTime,
      durationMin,
    })
  }

  // 시간 순 정렬
  return results.sort((a, b) => a.startTime.localeCompare(b.startTime))
}