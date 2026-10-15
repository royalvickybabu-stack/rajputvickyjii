export function decodeNewsEntities(value: string): string {
  let result = value;

  for (let i = 0; i < 2; i++) {
    result = result
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&nbsp;/gi, " ")
      .replace(/&#(\d+);/g, (_, n: string) =>
        String.fromCodePoint(Number(n))
      )
      .replace(/&#x([0-9a-f]+);/gi, (_, n: string) =>
        String.fromCodePoint(parseInt(n, 16))
      )
      .replace(/&amp;/gi, "&");
  }

  return result;
}

export function stripNewsHtml(value: string | null | undefined): string {
  if (!value) return "";

  return decodeNewsEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
