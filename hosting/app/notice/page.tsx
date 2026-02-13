"use client";
import CommonNavBar from "component/CommonNavBar";
import CommonFooter from "component/CommonFooter";
import { useEffect, useMemo, useState } from "react";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { FireStoreRepository } from "repository/FireStoreRepository";
import type { NoticeEntity } from "model/NoticeEntity";
import { Button, Spinner } from "@heroui/react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [notices, setNotices] = useState<NoticeEntity[]>([]);
  const [seasonId, setSeasonId] = useState<string>("");

  const fetchNotices = async () => {
    setLoading(true);
    try {
      await FirebaseAuthRepository.initialize();
      const isLoggedIn = !!FirebaseAuthRepository.uid;
      setLoggedIn(isLoggedIn);
      if (!isLoggedIn || !FirebaseAuthRepository.uid) {
        setNotices([]);
        setSeasonId("");
        return;
      }
      const userInfo = await FireStoreRepository.getUserInfo(FirebaseAuthRepository.uid);
      if (!userInfo?.seasonId) {
        setNotices([]);
        setSeasonId("");
        return;
      }
      setSeasonId(userInfo.seasonId);
      const data = await FireStoreRepository.getAllNotice(userInfo.seasonId);
      setNotices(data.filter((notice) => notice.isPublish));
    } catch (e) {
      console.error(e);
      addToast({ title: "お知らせの取得に失敗しました。", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => (b.orderId ?? 0) - (a.orderId ?? 0));
  }, [notices]);

  return (
    <div className="min-h-screen bg-neutral-100 relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <Spinner
            color="primary"
            label=""
            size="lg"
          />
        </div>
      )}
      <CommonNavBar title={"お知らせ"} />
      <div className="min-h-screen max-w-6xl mx-auto px-4 py-8">
        {!loggedIn ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
            <div className="text-lg font-bold text-neutral-800 mb-2">ログインが必要です</div>
            <div className="text-sm text-neutral-600 mb-4">お知らせを見るには、アカウントでログインしてください。</div>
            <Link href="/account">
              <Button color="primary">アカウントページへ</Button>
            </Link>
          </div>
        ) : !seasonId ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
            <div className="text-lg font-bold text-neutral-800 mb-2">シーズン情報が未設定です</div>
            <div className="text-sm text-neutral-600 mb-4">事前アンケートで受講シーズンを設定してください。</div>
            <Link href="/account">
              <Button color="primary">アンケートへ</Button>
            </Link>
          </div>
        ) : sortedNotices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center">
            <div className="text-sm text-neutral-600">お知らせはまだありません。</div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5"
              >
                <div className="text-lg font-bold text-neutral-800">{notice.title}</div>
                <div className="text-sm text-neutral-700 whitespace-pre-line mt-2">{notice.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CommonFooter />
    </div>
  );
};

export default Page;
