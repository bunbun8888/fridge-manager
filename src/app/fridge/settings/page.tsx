import Link from "next/link";
import FooterMenu from "@/components/FooterMenu";

export default function SettingsPage() {
  return (
    <div className="pb-24 px-4 pt-4 min-h-screen flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-semibold mb-4">設定</h1>
        <p>ここに設定項目を追加していきましょう。</p>
      </div>

      <div className="relative">
        <Link
          href="/fridge/items"
          className="absolute bottom-4 left-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ← 戻る
        </Link>
        <FooterMenu />
      </div>
    </div>
  );
}
