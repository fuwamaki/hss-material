"use client";

import CommonNavBar from "component/CommonNavBar";

import { Button, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { FireStoreRepository } from "repository/FireStoreRepository";
type NoticeEntity = {
  id: string;
  title: string;
  description: string;
  isPublish: boolean;
  orderId: number;
  createdAt: any;
  updatedAt: any;
};
import AccountIcon from "icons/account";
import ChatIcon from "icons/chat";
import SubmissionIcon from "icons/submission";
import Link from "next/link";

const Page = () => {
  const [latestNotice, setLatestNotice] = useState<NoticeEntity | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      const notice = await FireStoreRepository.getLatestPublishedNotice();
      setLatestNotice(notice);
    };
    fetchLatest();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <CommonNavBar title="AIプログラミング体験" />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-6xl mx-2">
          <Link href="/account">
            <Button
              color="primary"
              variant="solid"
              className="w-full font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
            >
              登録・ログインはこちら
            </Button>
          </Link>
          <Link href="/account">
            <Button
              color="primary"
              variant="solid"
              className="w-full mt-4 font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
            >
              事前アンケートに回答をお願いします
            </Button>
          </Link>
          {/* 最新お知らせ */}
          {latestNotice && (
            <div className="my-4">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-2">
                <div className="font-semibold text-sky-800 text-lg mb-1">【最新お知らせ】{latestNotice.title}</div>
                <div className="text-sky-900 whitespace-pre-line text-sm">{latestNotice.description}</div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Link href="/notice">
              <Button
                color="primary"
                variant="solid"
                className="font-bold bg-sky-100 text-sky-700"
              >
                お知らせ一覧へ
              </Button>
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Link
              href="/account"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-28 font-bold bg-linear-to-tr from-indigo-400 to-indigo-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
              >
                <AccountIcon className="white" />
                <span>アカウント</span>
              </Button>
            </Link>
            <Link
              href="/chat"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-28 font-bold bg-linear-to-tr from-indigo-400 to-indigo-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
              >
                <ChatIcon className="white" />
                <span>質問する</span>
              </Button>
            </Link>
            <Link
              href="/submission"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-28 font-bold bg-linear-to-tr from-indigo-400 to-indigo-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
              >
                <SubmissionIcon className="white" />
                <span>提出する</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
