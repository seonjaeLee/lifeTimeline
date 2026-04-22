const CLAUDE_API_KEY = 'YOUR_API_KEY_HERE' // 나중에 실제 키로 교체
const MODEL = 'claude-haiku-4-5-20251001' // 빠르고 저렴한 모델

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

// 1. 장소명 자동 정리
export async function cleanPlaceName(rawName: string): Promise<string> {
  const prompt = `다음은 구글 타임라인에서 가져온 장소명입니다. 사람이 읽기 좋게 간결하게 정리해주세요. 장소명만 반환하고 다른 설명은 하지 마세요.

장소명: ${rawName}

정리된 장소명:`
  const result = await callClaude(prompt)
  return result.trim()
}

// 2. 지출 카테고리 자동 분류
export async function classifyCategory(placeName: string, amount: number): Promise<string> {
  const prompt = `다음 장소와 금액을 보고 지출 카테고리를 하나만 골라주세요. 카테고리명만 반환하고 다른 설명은 하지 마세요.

카테고리 목록: 식비, 교통, 쇼핑, 숙박, 의료, 문화, 기타

장소: ${placeName}
금액: ${amount}원

카테고리:`
  const result = await callClaude(prompt)
  const valid = ['식비', '교통', '쇼핑', '숙박', '의료', '문화', '기타']
  const found = valid.find((c) => result.includes(c))
  return found ?? '기타'
}

// 3. 하루 한 줄 요약
export async function summarizeDay(places: { place: string; memo: string; expense: number }[]): Promise<string> {
  if (places.length === 0) return ''
  const placeList = places.map((p) => `- ${p.place}${p.memo ? ` (${p.memo})` : ''}${p.expense > 0 ? ` / ${p.expense.toLocaleString()}원 지출` : ''}`).join('\n')
  const prompt = `다음은 오늘 방문한 장소 목록입니다. 하루를 자연스럽고 따뜻하게 한 줄로 요약해주세요. 한 문장만 반환하세요.

${placeList}

한 줄 요약:`
  const result = await callClaude(prompt)
  return result.trim()
}