import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@heroui/react";

interface CommonNavBarProps {
  title: string;
}

const CommonNavBar: React.FC<CommonNavBarProps> = ({ title }) => {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link
          color="foreground"
          href="/"
        >
          じぶんラボ
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <b>{title}</b>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent />
    </Navbar>
  );
};

export default CommonNavBar;
