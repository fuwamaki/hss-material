"use client";
import { useEffect, useMemo, useState } from "react";
import CommonNavBar from "component/CommonNavBar";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { FireStoreRepository } from "repository/FireStoreRepository";
import type { ChatMessageEntity } from "model/ChatMessageEntity";
import { Button, Textarea, Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";
import Link from "next/link";

const Page = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageEntity[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const isLoading = loading || sending;

  const fetchMessages = async (targetUid: string) => {
    setLoading(true);
    try {
      const data = await FireStoreRepository.getChatMessagesByStudentId(targetUid);
      setMessages(data);
    } catch (e) {
      console.error(e);
      addToast({ title: "メッセージの取得に失敗しました。", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await FirebaseAuthRepository.initialize();
      if (FirebaseAuthRepository.uid) {
        setUid(FirebaseAuthRepository.uid);
        await fetchMessages(FirebaseAuthRepository.uid);
      } else {
        setUid(null);
      }
    })();
  }, []);

  const handleSend = async () => {
    if (!uid) return;
    if (!message.trim()) {
      addToast({ title: "メッセージを入力してください。", color: "warning" });
      return;
    }
    setSending(true);
    try {
      await FireStoreRepository.sendStudentChatMessage(uid, uid, message.trim());
      setMessage("");
      addToast({ title: "送信しました。", color: "success" });
      await fetchMessages(uid);
    } catch (e) {
      addToast({ title: "送信に失敗しました。", color: "danger" });
    } finally {
      setSending(false);
    }
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aTime =
        typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : new Date(a.createdAt as any).getTime();
      const bTime =
        typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : new Date(b.createdAt as any).getTime();
      return aTime - bTime;
    });
  }, [messages]);

  const formatDate = (value: unknown) => {
    if (!value) return "";
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === "string") return new Date(value).toLocaleString();
    if (typeof value === "object") {
      const obj = value as { toDate?: () => Date; seconds?: number };
      if (typeof obj.toDate === "function") return obj.toDate().toLocaleString();
      if (typeof obj.seconds === "number") return new Date(obj.seconds * 1000).toLocaleString();
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-neutral-100 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <Spinner
            color="primary"
            label="simple"
            size="lg"
          />
        </div>
      )}
      <CommonNavBar title="講師に質問" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!uid ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
            <div className="text-lg font-bold text-neutral-800 mb-2">ログインが必要です</div>
            <div className="text-sm text-neutral-600 mb-4">質問するには、アカウントでログインしてください。</div>
            <Link href="/account">
              <Button color="primary">アカウントページへ</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
              <div className="flex items-center mb-3">
                <div className="text-lg font-bold text-neutral-800">チャット</div>
                <Button
                  variant="flat"
                  color="primary"
                  onPress={() => fetchMessages(uid)}
                  className="ml-3"
                >
                  更新
                </Button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {sortedMessages.length === 0 ? (
                  <div className="text-sm text-neutral-500">まだメッセージはありません。</div>
                ) : (
                  sortedMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderRole === "student" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                          msg.senderRole === "student"
                            ? "bg-indigo-500 text-white"
                            : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                        }`}
                      >
                        <div>{msg.message}</div>
                        <div
                          className={`mt-1 text-[10px] ${
                            msg.senderRole === "student" ? "text-indigo-100" : "text-neutral-500"
                          }`}
                        >
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
              <div className="text-sm text-neutral-600 mb-2">先生への質問を入力してください</div>
              <Textarea
                minRows={4}
                placeholder="例：このコードの意味を教えてください"
                value={message}
                onValueChange={setMessage}
              />
              <div className="mt-3 flex justify-end">
                <Button
                  color="primary"
                  onPress={handleSend}
                >
                  送信
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
