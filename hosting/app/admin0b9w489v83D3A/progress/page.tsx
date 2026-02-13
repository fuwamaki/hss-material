"use client";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import CommonFooter from "component/CommonFooter";

const Page = () => {
  return (
    <AdminAuth>
      <div>
        <AdminNavBar title={"サンプルページ"} />
        <CommonFooter />
      </div>
    </AdminAuth>
  );
};

export default Page;
