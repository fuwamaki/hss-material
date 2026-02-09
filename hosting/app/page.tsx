"use client";

import CommonNavBar from "component/CommonNavBar";

import { Button } from "@heroui/react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <CommonNavBar title="AIプログラミング体験" />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-4xl mx-2">
          <Link href="/auth">
            <Button
              color="primary"
              variant="solid"
              className="w-full font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
            >
              登録・ログインはこちら
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              color="primary"
              variant="solid"
              className="w-full mt-4 font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
            >
              事前アンケートに回答をお願いします
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
