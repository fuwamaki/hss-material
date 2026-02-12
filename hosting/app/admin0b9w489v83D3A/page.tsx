"use client";
import AdminNavBar from "component/AdminNavBar";
import AdminAuth from "./AdminAuth";
import { Button } from "@heroui/react";
import AccountIcon from "icons/account";
import ChatIcon from "icons/chat";
import SubmissionIcon from "icons/submission";
import Link from "next/link";

const Page = () => {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-neutral-100">
        <AdminNavBar title="TOP" />
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-6xl mx-2">
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Link
                href="/admin0b9w489v83D3A/user-info"
                className="w-full"
              >
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full h-28 font-bold bg-linear-to-tr from-teal-400 to-teal-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <AccountIcon className="white" />
                  <span>ユーザー管理</span>
                </Button>
              </Link>
              <Link
                href="/admin0b9w489v83D3A/progress"
                className="w-full"
              >
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full h-28 font-bold bg-linear-to-tr from-teal-400 to-teal-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <ChatIcon className="white" />
                  <span>進捗管理</span>
                </Button>
              </Link>
              <Link
                href="/admin0b9w489v83D3A/documentation"
                className="w-full"
              >
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full h-28 font-bold bg-linear-to-tr from-teal-400 to-teal-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <SubmissionIcon className="white" />
                  <span>ドキュメント管理</span>
                </Button>
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Link
                href="/admin0b9w489v83D3A/notice"
                className="w-full"
              >
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full h-28 font-bold bg-linear-to-tr from-teal-400 to-teal-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <AccountIcon className="white" />
                  <span>お知らせ管理</span>
                </Button>
              </Link>
              <Link
                href="/admin0b9w489v83D3A/chat"
                className="w-full"
              >
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full h-28 font-bold bg-linear-to-tr from-teal-400 to-teal-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <ChatIcon className="white" />
                  <span>チャット</span>
                </Button>
              </Link>
              <Link
                href="/admin0b9w489v83D3A/submission"
                className="w-full"
              >
                <Button
                  color="primary"
                  variant="solid"
                  className="w-full h-28 font-bold bg-linear-to-tr from-teal-400 to-teal-500 text-white shadow-lg flex flex-col items-center justify-center gap-2"
                >
                  <SubmissionIcon className="white" />
                  <span>提出管理</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
};

export default Page;
