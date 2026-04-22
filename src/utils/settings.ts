// 앱 설정 전역 상태 (나중에 SQLite로 교체)
export const DEFAULT_SETTINGS = {
  aiPlaceClean: true,      // 장소명 자동 정리
  aiCategoryAuto: true,    // 카테고리 자동 분류
  aiDaySummary: false,     // 하루 한 줄 요약
}

export type AppSettings = typeof DEFAULT_SETTINGS