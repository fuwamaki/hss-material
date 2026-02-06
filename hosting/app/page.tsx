"use client";

import CommonNavBar from "component/CommonNavBar";

import { Button } from "@heroui/react";
import Link from "next/link";

const Page = () => {
  return (
    <div>
      <CommonNavBar title="AIプログラミング体験" />
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-5xl">
          <Link href="/auth">
            <Button
              color="primary"
              variant="solid"
              className="w-full text-lg font-bold"
            >
              登録・ログインはこちら
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
