import Fuse from 'fuse.js';

type Item = {
  name: string;
  quantity: number;
  unit: string;
};

// Supabaseから取得した食品名リスト（例: ['たまねぎ', 'にんじん', '牛乳', ...]）
export default function parseItemsFromText(text: string, foodNames: string[]): Item[] {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  const units = ['個', 'g', 'kg', 'ml', 'L', '本', 'パック', '袋', '缶', '枚', '杯', '匹', 'その他'];
  const unitPattern = units.join('|');
  const itemRegex = new RegExp(`(.+?)\\s*(\\d+)?\\s*(${unitPattern})`);

  // Fuse.jsの設定
  const fuse = new Fuse(foodNames, {
    threshold: 0.3,
    includeScore: true,
  });

  const results: Item[] = [];

  for (const line of lines) {
    const match = line.match(itemRegex);
    if (!match) continue;

    const nameCandidate = match[1].trim();
    const quantity = parseInt(match[2] ?? '1', 10);
    const unit = match[3];

    const fuseResult = fuse.search(nameCandidate);
    const matchedName = fuseResult.length > 0 ? fuseResult[0].item : nameCandidate;

    results.push({
      name: matchedName,
      quantity,
      unit,
    });
  }

  return results;
}
