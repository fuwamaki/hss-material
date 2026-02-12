"use client";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";

const Page = () => {
  return (
    <AdminAuth>
      <div>
        <AdminNavBar title={"サンプルページ"} />
      </div>
    </AdminAuth>
  );
};

export default Page;
