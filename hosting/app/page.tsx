"use client";

import CommonNavBar from "component/CommonNavBar";

import { Button, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { FireStoreRepository } from "repository/FireStoreRepository";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import AccountIcon from "icons/account";
import ChatIcon from "icons/chat";
import SubmissionIcon from "icons/submission";
import Link from "next/link";
import { NoticeEntity } from "model/NoticeEntity";
import { isUserInfoAnswered } from "model/UserInfoEntity";

const Page = () => {
  const [latestNotice, setLatestNotice] = useState<NoticeEntity | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      try {
        await FirebaseAuthRepository.initialize();
        const isLoggedIn = !!FirebaseAuthRepository.uid;
        setLoggedIn(isLoggedIn);
        if (isLoggedIn) {
          // 事前アンケート回答有無チェック
          const userInfo = await FireStoreRepository.getUserInfo(FirebaseAuthRepository.uid);
          setAnswered(isUserInfoAnswered(userInfo));
          if (userInfo?.seasonId) {
            const notice = await FireStoreRepository.getLatestPublishedNotice(userInfo.seasonId);
            setLatestNotice(notice);
          } else {
            setLatestNotice(null);
          }
        } else {
          setAnswered(false);
          setLatestNotice(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 relative">
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Spinner
            color="primary"
            label=""
            size="lg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 relative">
      <CommonNavBar title="AIプログラミング体験" />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-6xl mx-2">
          {!loggedIn && (
            <Link href="/account">
              <Button
                color="primary"
                variant="solid"
                className="w-full font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
              >
                登録・ログインはこちら
              </Button>
            </Link>
          )}
          {loggedIn && !answered && (
            <Link href="/account">
              <Button
                color="primary"
                variant="solid"
                className="w-full mt-4 font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
              >
                事前アンケートに回答をお願いします
              </Button>
            </Link>
          )}
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
              href="/documentation/start"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-20 font-bold text-md bg-indigo-100 text-indigo-700 shadow-lg flex flex-col items-center justify-center gap-2"
              >
                <span>初日説明資料</span>
              </Button>
            </Link>
            <Link
              href="/documentation/faq"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-20 font-bold text-md bg-indigo-100 text-indigo-700 shadow-lg flex flex-col items-center justify-center gap-2"
              >
                <span>FAQ</span>
              </Button>
            </Link>
            <Link
              href="/documentation/original-plan"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-20 font-bold text-md bg-indigo-100 text-indigo-700 shadow-lg flex flex-col items-center justify-center gap-2"
              >
                <span>最終日資料</span>
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
          <Link href="/documentation/setup">
            <Button
              color="primary"
              variant="solid"
              className="w-full mt-6 h-14 font-bold text-md bg-indigo-50 border-1 border-indigo-500 text-indigo-700 shadow-lg flex flex-col items-center justify-center gap-2"
            >
              Step1: AIプログラミングできるようにPCをセットアップしよう
            </Button>
          </Link>
          <Link href="/documentation/common-issue">
            <Button
              color="primary"
              variant="solid"
              className="w-full mt-4 h-14 font-bold text-md bg-indigo-50 border-1 border-indigo-500 text-indigo-700 shadow-lg flex flex-col items-center justify-center gap-2"
            >
              Step2: AIプログラミングに慣れるための共通課題
            </Button>
          </Link>
          <Link href="/documentation/original-plan">
            <Button
              color="primary"
              variant="solid"
              className="w-full mt-4 h-14 font-bold text-md bg-indigo-50 border-1 border-indigo-500 text-indigo-700 shadow-lg flex flex-col items-center justify-center gap-2"
            >
              Step3: オリジナルWebサイトをつくろう
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
