import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";

interface CommonNavBarProps {
  title: string;
}

const CommonNavBar: React.FC<CommonNavBarProps> = ({ title }) => {
  return (
    <Navbar
      isBordered
      maxWidth="full"
      className="bg-neutral-100 text-slate-900 h-14 px-3 sm:px-4 shadow-md"
    >
      <NavbarBrand className="gap-2">
        <Link
          href="/"
          color="foreground"
          underline="none"
          className="flex items-center gap-2 text-base md:text-2xl font-bold text-slate-900"
        >
          <span>じぶんラボ</span>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem className="md:text-xl text-slate-900">
          <b>{title}</b>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent />
    </Navbar>
  );
};

export default CommonNavBar;
