"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await supabase.auth.signInWithPassword({
      email: "cgsj0018@mail4.doshisha.ac.jp",
      password: "yuuyuu531531",
    });

    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert("ファイルを選択してください");
      setLoading(false);
      return;
    }

    // ファイル名を英数字だけに強制変換
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filePath = `uploads/${timestamp}_file.${extension}`;
    const fileType = file.type;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("post-files")
      .upload(filePath, file);

    if (storageError || !storageData) {
      alert(`アップロード失敗: ${storageError.message}`);
      setLoading(false);
      return;
    }

    const fileUrl = supabase.storage
      .from("post-files")
      .getPublicUrl(storageData.path).data.publicUrl;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("👤 current user:", user);

    // 📝 posts テーブルに insert
    const { error: insertError } = await supabase.from("posts").insert({
      title,
      description,
      file_url: fileUrl,
      is_admin: false,
      user_id: user?.id,
      file_type: fileType,
    });

    if (insertError) {
      alert(`投稿失敗: ${insertError.message}`);
      setLoading(false);
      return;
    }

    // ✅ 成功時
    alert("投稿が完了しました！");
    setTitle("");
    setDescription("");
    if (fileRef.current) fileRef.current.value = "";
    router.push("/posts");
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2"
      />
      <textarea
        placeholder="説明"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="border p-2"
      />
      <input
        type="file"
        ref={fileRef}
        accept=".pdf,.docx,.jpg"
        className="p-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "投稿中..." : "投稿する"}
      </button>
    </form>
  );
}
