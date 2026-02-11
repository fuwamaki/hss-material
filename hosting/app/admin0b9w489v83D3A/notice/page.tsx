"use client";
import AdminNavBar from "component/AdminNavBar";

import AdminAuth from "../AdminAuth";

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
