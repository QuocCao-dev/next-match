"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { usePagination, type Selection } from "@nextui-org/react";
import usePaginationStore from "./usePaginationStore";

const orderByList = [
  { label: "Last active", value: "updated" },
  { label: "Newest members", value: "created" },
];

const genderList = [
  { value: "male", icon: FaMale },
  { value: "female", icon: FaFemale },
];

export const useFilters = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const { filters, setFilters } = useFilterStore();

  const { pageNumber, pageSize, setPage, setPageSize } = usePaginationStore(
    (state) => ({
      pageNumber: state.pagination.pageNumber,
      pageSize: state.pagination.pageSize,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
    })
  );

  const { gender, orderBy, ageRange } = filters;

  useEffect(() => {
    if (gender || ageRange || orderBy) {
      setPage(1);
    }
  }, [gender, ageRange, orderBy, setPage]);

  useEffect(() => {
    startTransition(() => {
      const searchParams = new URLSearchParams();
      if (gender) searchParams.set("gender", gender.join(","));
      if (ageRange) searchParams.set("ageRange", ageRange.toString());
      if (orderBy) searchParams.set("orderBy", orderBy);
      if (pageSize) searchParams.set("pageSize", pageSize.toString());
      if (pageNumber) searchParams.set("pageNumber", pageNumber.toString());

      router.replace(`${pathname}?${searchParams}`);
    });
  }, [gender, orderBy, ageRange, pathname, router, pageNumber, pageSize]);

  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value);
  };

  const handleOrderSelect = (value: Selection) => {
    if (value instanceof Set) {
      setFilters("orderBy", value.values().next().value);
    }
  };

  const handleGenderSelect = (value: string) => {
    setFilters(
      "gender",
      gender.includes(value)
        ? gender.filter((v) => v !== value)
        : [...gender, value]
    );
  };

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    filters,
    clientLoaded,
    setClientLoaded,
    isPending,
  };
};
