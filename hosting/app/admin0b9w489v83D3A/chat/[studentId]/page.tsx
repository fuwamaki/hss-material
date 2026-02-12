"use client";
import { use, useEffect, useMemo, useState } from "react";
import AdminAuth from "../../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
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
  const isLoading = loading || sending;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await FireStoreAdminRepository.getChatMessagesByStudentId(studentId);
      setMessages(data);
    } catch (e) {
      addToast({ title: "メッセージの取得に失敗しました。", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudent = async () => {
    try {
      const allUsers = await FireStoreAdminRepository.getAllUserInfo();
      const target = allUsers.find((user) => user.uid === studentId) || null;
      setStudent(target);
    } catch (e) {
      addToast({ title: "生徒情報の取得に失敗しました。", color: "danger" });
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchMessages();
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
      await fetchMessages();
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
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
            <Spinner
              color="primary"
              label="simple"
              size="lg"
            />
          </div>
        )}
        <AdminNavBar title="チャット管理" />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-neutral-800">チャット</div>
              <div className="text-sm text-neutral-500">{displayName || student?.email || "生徒情報"}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="flat"
                color="primary"
                onPress={fetchMessages}
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
      </div>
    </AdminAuth>
  );
};

export default Page;
