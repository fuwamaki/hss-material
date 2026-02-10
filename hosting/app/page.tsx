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
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Link
              href="/account"
              className="w-full"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full h-28 font-bold bg-white border-1 border-indigo-200 text-indigo-700 flex flex-col items-center justify-center gap-2"
              >
                <AccountIcon />
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
                className="w-full h-28 font-bold bg-white border-1 border-indigo-200 text-indigo-700 flex flex-col items-center justify-center gap-2"
              >
                <ChatIcon />
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
                className="w-full h-28 font-bold bg-white border-1 border-indigo-200 text-indigo-700 flex flex-col items-center justify-center gap-2"
              >
                <SubmissionIcon />
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
