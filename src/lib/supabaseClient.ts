//Supabaseのクライアント関数を使うためにパッケージから読み込む
import { createClient } from "@supabase/supabase-js";

//.env.local に書いたURLを読み込む（！は「絶対ある」とTypeScriptに伝える記号）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

//.env.local に書いたanonキー（公開キー）を読み込む
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

//Supabaseとの通信オブジェクトを作成（supabaseという変数で扱えるようにする）
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
