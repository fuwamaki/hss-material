"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const unsubscribeRef = useRef<null | (() => void)>(null);

  const isLoading = loading || sending;

  const startMessagesListener = (targetUid: string) => {
    setLoading(true);
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    unsubscribeRef.current = FireStoreRepository.getChatMessagesByStudentId(
      targetUid,
      (data) => {
        setMessages(data);
        setLoading(false);
      },
      () => {
        addToast({ title: "メッセージの取得に失敗しました。", color: "danger" });
        setLoading(false);
      },
    );
  };

  useEffect(() => {
    (async () => {
      await FirebaseAuthRepository.initialize();
      if (FirebaseAuthRepository.uid) {
        setUid(FirebaseAuthRepository.uid);
        startMessagesListener(FirebaseAuthRepository.uid);
      } else {
        setUid(null);
      }
    })();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
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
            label=""
            size="lg"
          />
        </div>
      )}
      <CommonNavBar title="講師に質問" />
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                  onPress={() => startMessagesListener(uid)}
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
              <Textarea
                className="my-2"
                minRows={4}
                placeholder="Aa"
                value={message}
                onValueChange={setMessage}
              />
              <div className="mt-4 flex justify-end">
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
