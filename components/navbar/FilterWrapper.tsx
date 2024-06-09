"use client";

import { usePathname } from "next/navigation";
import Filters from "./Filters";

const FilterWrapper = () => {
  const pathname = usePathname();

  if (pathname === "/members") return <Filters />;
  return null;
};
export default FilterWrapper;
