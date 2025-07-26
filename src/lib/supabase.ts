// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getKnownFoods = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('foods')
    .select('name');

  if (error) {
    console.error('食品名の取得に失敗しました:', error.message);
    return [];
  }

  return data.map((item: { name: string }) => item.name);
};