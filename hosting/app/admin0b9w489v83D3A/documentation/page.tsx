"use client";
import CommonNavBar from "component/CommonNavBar";
import AdminAuth from "../AdminAuth";

const Page = () => {
  return (
    <AdminAuth>
      <div>
        <CommonNavBar title={"サンプルページ"} />
      </div>
    </AdminAuth>
  );
};

export default Page;
