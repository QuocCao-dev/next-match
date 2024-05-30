import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/app/auth";
import UserMenu from "./UserMenu";
import { getUserInfoForNav } from "@/app/actions/userActions";

const TopNav = async () => {
  const session = await auth();
  const userInfo = session?.user && (await getUserInfoForNav());

  return (
    <Navbar
      maxWidth="xl"
      className="bg-gradient-to-r from-purple-400 to bg-purple-700"
      classNames={{
        item: [
          "text-xl",
          "text-white",
          "uppercase",
          "data-[active=true]:text-yellow-200",
        ],
      }}
    >
      <NavbarBrand as={Link} href="/">
        <GiMatchTip size={40} className="text-gray-200" />
        <div className="font-bold text-3xl flex">
          <span className="text-gray-900">Next</span>
          <span className="text-gray-200">Match</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavLink href="/members" label="Matches" />
        <NavLink href="/lists" label="Lists" />
        <NavLink href="/messages" label="Messages" />
      </NavbarContent>
      <NavbarContent justify="end">
        {userInfo ? (
          <UserMenu userInfo={userInfo} />
        ) : (
          <>
            <Button
              as={Link}
              href="/login"
              className="text-white"
              variant="bordered"
            >
              Login
            </Button>
            <Button
              as={Link}
              href="/register"
              className="text-white"
              variant="bordered"
            >
              Register
            </Button>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default TopNav;
