// クライアントコンポーネントとして使う宣言（Hooks使うなら必須）
"use client";

// ReactのHooksをインポート
import { useEffect, useState } from "react";

//Supabaseクライアントの読み込み
import { supabase } from "@/lib/supabaseClient";

// 投稿の型（仮で定義、あとで調整可）
type Post = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

// 投稿一覧ページの関数コンポーネント
export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  //コンポーネントが表示されたタイミングで投稿一覧を取得
  useEffect(() => {
    //非同期関数を定義
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts") // ← どのテーブルから取るか？
        .select("id, title, description, created_at") // ← どの列（カラム）を取るか？
        .order("created_at", { ascending: false }); // ← 並び順はどうするか？

      if (error) {
        console.error("取得エラー:", error);
      } else {
        setPosts(data); // 投稿一覧の状態にセット（画面に表示される）
      }
    };

    fetchPosts(); // 定義した関数をすぐ呼び出す
  }, []); // 空配列なので「初回だけ」実行され

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">投稿一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b py-2">
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
