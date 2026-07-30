export function getTargetLabel(code: string) {
  const map: Record<string, string> = {
    "010": "정상아동(18세미만)",
    "020": "가출인",
    "040": "시설보호무연고자",
    "060": "지적장애인",
    "061": "지적장애인(18세미만)",
    "062": "지적장애인(18세이상)",
    "070": "치매질환자",
    "080": "불상(기타)",
  };
  return map[code] || code;
}
