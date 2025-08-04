import Link from "next/link";

export default function HomeFeatures() {
  return (
    <main className="p-6 pb-24 bg-gradient-to-b from-white to-lime-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">おうち管理しすてむ</h1>

        <div className="space-y-6">
          <Link href="/fridge/items">
            <div className="p-5 rounded-xl shadow-md bg-white border hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold text-blue-700">🍅 冷蔵庫管理</h2>
              <p className="text-sm text-gray-600 mt-1">
                OCRでレシートから食材を読み取って管理します。
              </p>
            </div>
          </Link>

          <Link href="/supplies">
            <div className="p-5 rounded-xl shadow-md bg-white border hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold text-green-700">📦 消耗品在庫管理</h2>
              <p className="text-sm text-gray-600 mt-1">
                トイレットペーパーや洗剤などの在庫チェック。
              </p>
            </div>
          </Link>

          <Link href="/settings">
            <div className="p-5 rounded-xl shadow-md bg-white border hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold text-gray-700">⚙️ 設定</h2>
              <p className="text-sm text-gray-600 mt-1">
                カテゴリ・単位・保存場所などのマスタ管理。
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
