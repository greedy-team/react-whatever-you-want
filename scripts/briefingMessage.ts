export async function buildSectionText(
  label: string,
  getText: () => Promise<string>,
) {
  try {
    return `${label} ${await getText()}`;
  } catch {
    return `${label} 조회 실패`;
  }
}

export function truncateMessage(text: string) {
  return text.length > 200 ? `${text.slice(0, 197)}...` : text;
}
