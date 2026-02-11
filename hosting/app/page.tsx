"use client";

import CommonNavBar from "component/CommonNavBar";

import { Button } from "@heroui/react";
import AccountIcon from "icons/account";
import ChatIcon from "icons/chat";
import SubmissionIcon from "icons/submission";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <CommonNavBar title="AIプログラミング体験" />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-4xl mx-2">
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
          <div className="flex justify-end mt-4">
            <Link href="/notice">
              <Button
                color="primary"
                variant="solid"
                className="font-bold bg-indigo-100 text-indigo-700"
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
                className="w-full h-28 font-bold bg-linear-to-tr from-indigo-300 to-indigo-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
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
                className="w-full h-28 font-bold bg-linear-to-tr from-indigo-300 to-indigo-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
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
                className="w-full h-28 font-bold bg-linear-to-tr from-indigo-300 to-indigo-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
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
