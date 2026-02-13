"use client";

const CommonFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-indigo-950 text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8">
        <p className="text-sm font-semibold text-white/90">© {year} HSS(Hiratsuka Secondary School) じぶんラボ</p>
      </div>
    </footer>
  );
};

export default CommonFooter;
