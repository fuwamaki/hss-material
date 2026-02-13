"use client";
import { use, useEffect, useMemo, useRef, useState } from "react";
import AdminAuth from "../../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import CommonFooter from "component/CommonFooter";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { ChatMessageEntity } from "model/ChatMessageEntity";
import type { UserInfoEntity } from "model/UserInfoEntity";
import { Button, Spinner, Textarea } from "@heroui/react";
import { addToast } from "@heroui/toast";
import Link from "next/link";

const Page = ({ params }: { params: Promise<{ studentId: string }> }) => {
  const { studentId } = use(params);
  const [messages, setMessages] = useState<ChatMessageEntity[]>([]);
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState<UserInfoEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const unsubscribeRef = useRef<null | (() => void)>(null);
  const unsubscribeUserRef = useRef<null | (() => void)>(null);
  const isLoading = loading || sending;

  const startMessagesListener = () => {
    setLoading(true);
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    unsubscribeRef.current = FireStoreAdminRepository.getChatMessagesByStudentId(
      studentId,
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

  const startStudentListener = () => {
    if (unsubscribeUserRef.current) {
      unsubscribeUserRef.current();
    }
    unsubscribeUserRef.current = FireStoreAdminRepository.getAllUserInfo(
      (users) => {
        const target = users.find((user) => user.uid === studentId) || null;
        setStudent(target);
      },
      () => {
        addToast({ title: "生徒情報の取得に失敗しました。", color: "danger" });
      },
    );
  };

  useEffect(() => {
    startStudentListener();
    startMessagesListener();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (unsubscribeUserRef.current) {
        unsubscribeUserRef.current();
      }
    };
  }, [studentId]);

  const handleSend = async () => {
    if (!message.trim()) {
      addToast({ title: "メッセージを入力してください。", color: "warning" });
      return;
    }
    setSending(true);
    try {
      await FireStoreAdminRepository.sendTeacherChatMessage(studentId, message.trim());
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

  const displayName = student ? `${student.lastName} ${student.firstName}`.trim() : "";

  return (
    <AdminAuth>
      <div className="min-h-screen bg-neutral-100 relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-cente">
            <Spinner
              color="primary"
              label=""
              size="lg"
            />
          </div>
        )}
        <AdminNavBar title="チャット管理" />
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-neutral-800">チャット</div>
              <div className="text-sm text-neutral-500">{displayName || student?.email || "生徒情報"}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="flat"
                color="primary"
                onPress={startMessagesListener}
              >
                更新
              </Button>
              <Link href="/admin0b9w489v83D3A/chat">
                <Button variant="flat">一覧へ戻る</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {sortedMessages.length === 0 ? (
                <div className="text-sm text-neutral-500">まだメッセージはありません。</div>
              ) : (
                sortedMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                        msg.senderRole === "admin"
                          ? "bg-indigo-500 text-white"
                          : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                      }`}
                    >
                      <div>{msg.message}</div>
                      <div
                        className={`mt-1 text-[10px] ${
                          msg.senderRole === "admin" ? "text-indigo-100" : "text-neutral-500"
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
        <CommonFooter />
      </div>
    </AdminAuth>
  );
};

export default Page;
