"use client";

import { useMemo, useContext, useState, useEffect } from "react";
import { Context } from "@/app/context";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDate, toSlug } from "@/utils";
import Link from "next/link";

export default function MainDirectory() {
  const today = new Date();
  const formattedDate = formatDate(today);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const filterParam = searchParams.get("filter") || "[]";
  const filter = useMemo(() => {
    if (/^\[\s*(?:"[^"]*"\s*,\s*)*"[^"]*"\s*\]$/.test(filterParam)) {
      try {
        return JSON.parse(filterParam);
      } catch {
        return [];
      }
    }
    return [];
  }, [filterParam]);

  const sortParam = searchParams.get("sort") || "globalRanking";
  const sort = [
    "domainName",
    "IPAddress",
    "hostingProvider",
    "globalRanking",
  ].includes(sortParam)
    ? sortParam
    : "globalRanking";

  const orderParam = searchParams.get("order") || "asc";
  const order = ["asc", "desc"].includes(orderParam) ? orderParam : "asc";

  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

  const router = useRouter();

  const { filterDropdownOpen, setFilterDropdownOpen } = useContext(Context);

  const handleFilterUpdate = (clickedItem) => {
    let updatedFilter;

    if (filter.includes(clickedItem)) {
      updatedFilter = filter.filter((item) => item !== clickedItem);
    } else {
      updatedFilter = [...filter, clickedItem];
    }

    if (updatedFilter.length > 0) {
      params.set("filter", JSON.stringify(updatedFilter));
    } else {
      params.delete("filter");
    }

    router.push(`?${params.toString()}`);

    setFilterDropdownOpen(false);
  };

  const handleSortUpdate = (clickedItem) => {
    params.set("sort", clickedItem);
    router.push(`?${params.toString()}`);

    handleOrderUpdate();
  };

  const handleOrderUpdate = () => {
    params.set("order", order === "asc" ? "desc" : "asc");
    router.push(`?${params.toString()}`);
  };

  const handlePageUpdate = (dir) => {
    params.set(
      "page",
      dir === "prev" ? (page - 1).toString() : (page + 1).toString()
    );
    router.push(`?${params.toString()}`);
  };

  const [hostingProviders, setHostingProviders] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [websites, setWebsites] = useState([]);
  const [pagesCount, setPagesCount] = useState(0);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const res = await fetch("/api/providers");

        if (!res.ok) {
          throw new Error();
        }

        const { hostingProviders } = await res.json();

        setHostingProviders(hostingProviders);
        setRecordsCount(
          hostingProviders.reduce(
            (sum, hostingProvider) => sum + hostingProvider.knownWebsitesCount,
            0
          )
        );
      } catch {
        console.log("Failed to fetch");
      }
    };

    handleFetch();
  }, []);

  useEffect(() => {
    setWebsites([]);
    setPagesCount(0);

    const handleFetch = async () => {
      try {
        const url = new URL("/api/websites", window.location.origin);

        url.searchParams.append("filter", JSON.stringify(filter));
        url.searchParams.append("sort", sort);
        url.searchParams.append("order", order);
        url.searchParams.append("page", page.toString());

        const res = await fetch(url.toString());

        if (!res.ok) {
          throw new Error();
        }

        const { websites, pagesCount } = await res.json();

        setWebsites(websites);
        setPagesCount(pagesCount);
      } catch {
        console.log("Failed to fetch");
      }
    };

    handleFetch();
  }, [filter, sort, order, page]);

  return (
    <main className="bg-[#fafafa]">
      <div className="border-b border-[#00000014]">
        <div className="max-w-screen-lg mx-auto px-4 py-10">
          <div className="mb-4 flex flex-row items-center justify-between">
            <h1 className="font-medium leading-10 text-[32px] text-[#171717]">
              Global Websites Directory
            </h1>
            <time
              className="hidden lg:inline text-[#171717]"
              dateTime={today.toISOString().split("T")[0]}
            >
              {formattedDate}
            </time>
          </div>
          {recordsCount ? (
            <p className="mb-4 lg:mb-0">
              This directory lists {recordsCount.toLocaleString()} websites from
              around the world, along with their IP addresses, hosting
              providers, and global rankings. You can sort the list by domain
              name, IP address, hosting provider, or global ranking in either
              ascending or descending order. You can also filter the results by
              hosting provider. The data is regularly updated to ensure
              accuracy.
            </p>
          ) : (
            <div className="animate-skeleton bg-[length:400%_100%] bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] mb-4 lg:mb-0 h-5 rounded-md w-full"></div>
          )}
          <time
            className="inline lg:hidden text-[#171717]"
            dateTime={today.toISOString().split("T")[0]}
          >
            {formattedDate}
          </time>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <div className="sm:relative">
          <button
            className="cursor-pointer bg-white duration-200 flex h-10 items-center justify-between px-4 rounded-md shadow-[0px_0px_0px_1px_#00000014] text-[#171717] transition-colors w-full hover:bg-[#f2f2f2]"
            onClick={() => setFilterDropdownOpen((prev) => !prev)}
          >
            <span className="hidden font-medium text-left sm:inline">
              {filter.length !== 0
                ? filter.map((item, index) =>
                    index < 4
                      ? index === filter.length - 1
                        ? item
                        : item + ", "
                      : ""
                  )
                : "Select Hosting Providers"}
              {filter.length > 4 ? `... +${filter.length - 4}` : ""}
            </span>
            <span className="inline font-medium text-left sm:hidden">
              {filter.length !== 0
                ? filter.map((item, index) =>
                    index < 2
                      ? index === filter.length - 1
                        ? item
                        : item + ", "
                      : ""
                  )
                : "Select Hosting Providers"}
              {filter.length > 2 ? `... +${filter.length - 2}` : ""}
            </span>
            <svg
              className="relative top-px"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                fill="currentColor"
              ></path>
            </svg>
          </button>
          <div
            className={`absolute h-fit pt-1.5 top-10 left-0 w-full z-10 ${
              filterDropdownOpen ? "hidden sm:block" : "hidden"
            }`}
          >
            <div className="bg-white h-fit max-h-[216px] overflow-auto p-2 rounded-lg shadow-[0px_0px_0px_1px_#00000014,0px_1px_1px_0px_#00000005,0px_4px_8px_-4px_#0000000a,0px_16px_24px_-8px_#0000000f] w-full">
              {hostingProviders.length
                ? hostingProviders.map((item, index) => (
                    <button
                      className="cursor-pointer duration-200 flex h-10 items-center justify-between px-2 rounded-md text-left text-[#171717] transition-colors w-full hover:bg-[#0000000D]"
                      key={index}
                      onClick={() => {
                        handleFilterUpdate(item.name);
                      }}
                    >
                      <span>{item.name}</span>
                      {filter.includes(item.name) ? (
                        <svg
                          className="h-[18px] w-[18px]"
                          fill="none"
                          height="24"
                          shapeRendering="geometricPrecision"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                      ) : (
                        ""
                      )}
                    </button>
                  ))
                : Array.from({ length: 5 }).map((_, index) => (
                    <div className="flex h-10 items-center px-2" key={index}>
                      <div className="animate-skeleton bg-[length:400%_100%] bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] h-5 rounded-md w-28"></div>
                    </div>
                  ))}
            </div>
          </div>
          <div
            className={`fixed h-full top-0 left-0 w-full z-30 bg-[#0006] sm:hidden transition-opacity duration-200 ${
              filterDropdownOpen ? "" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setFilterDropdownOpen(false)}
          ></div>
          <div
            className={`bottom-0 left-0 fixed h-fit max-h-[216px] w-full z-40 bg-white overflow-auto p-2 rounded-t-lg shadow-[0px_0px_0px_1px_#00000014,0px_1px_1px_0px_#00000005,0px_4px_8px_-4px_#0000000a,0px_16px_24px_-8px_#0000000f] sm:hidden transition-transform duration-200 ${
              filterDropdownOpen ? "" : "translate-y-full"
            }`}
          >
            {hostingProviders.length
              ? hostingProviders.map((item, index) => (
                  <button
                    className="cursor-pointer duration-200 flex h-10 items-center justify-between px-2 rounded-md text-left text-[#171717] transition-colors w-full hover:bg-[#0000000D]"
                    key={index}
                    onClick={() => {
                      handleFilterUpdate(item.name);
                    }}
                  >
                    <span>{item.name}</span>
                    {filter.includes(item.name) ? (
                      <svg
                        className="h-[18px] w-[18px]"
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    ) : (
                      ""
                    )}
                  </button>
                ))
              : Array.from({ length: 5 }).map((_, index) => (
                  <div className="flex h-10 items-center px-2" key={index}>
                    <div className="animate-skeleton bg-[length:400%_100%] bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] h-5 rounded-md w-28"></div>
                  </div>
                ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="border border-[#ebebeb] rounded-lg">
            <div className="overflow-auto">
              <table className="min-w-[768px] table-fixed w-full">
                <thead>
                  <tr>
                    <th className="h-10 px-4 text-left">
                      <div className="flex gap-x-2 items-center">
                        <span className="font-medium">Domain Name</span>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleSortUpdate("domainName")}
                        >
                          <svg
                            className={`h-2 w-4 ${
                              sort === "domainName" && order === "asc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                          <svg
                            className={`h-2 w-4 ${
                              sort === "domainName" && order === "desc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left">
                      <div className="flex gap-x-2 items-center">
                        <span className="font-medium">IP Address</span>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleSortUpdate("IPAddress")}
                        >
                          <svg
                            className={`h-2 w-4 ${
                              sort === "IPAddress" && order === "asc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                          <svg
                            className={`h-2 w-4 ${
                              sort === "IPAddress" && order === "desc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left">
                      <div className="flex gap-x-2 items-center">
                        <span className="font-medium">Hosting Provider</span>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleSortUpdate("hostingProvider")}
                        >
                          <svg
                            className={`h-2 w-4 ${
                              sort === "hostingProvider" && order === "asc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                          <svg
                            className={`h-2 w-4 ${
                              sort === "hostingProvider" && order === "desc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <th className="h-10 px-4 text-left">
                      <div className="flex gap-x-2 items-center">
                        <span className="font-medium">Global Ranking</span>
                        <button
                          className="cursor-pointer"
                          onClick={() => handleSortUpdate("globalRanking")}
                        >
                          <svg
                            className={`h-2 w-4 ${
                              sort === "globalRanking" && order === "asc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                          <svg
                            className={`h-2 w-4 ${
                              sort === "globalRanking" && order === "desc"
                                ? ""
                                : "opacity-50"
                            }`}
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                          >
                            <path
                              clipRule="evenodd"
                              d="M14.0607 5.49999L13.5303 6.03032L8.7071 10.8535C8.31658 11.2441 7.68341 11.2441 7.29289 10.8535L2.46966 6.03032L1.93933 5.49999L2.99999 4.43933L3.53032 4.96966L7.99999 9.43933L12.4697 4.96966L13 4.43933L14.0607 5.49999Z"
                              fill="currentColor"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {websites.length
                    ? websites.map((item, index) => (
                        <tr className="border-t border-[#ebebeb]" key={index}>
                          <td className="h-10 px-4 text-left">
                            <Link
                              className="gap-x-0.5 hover:text-[#171717] items-center transition-colors duration-200 flex"
                              href={`https://www.${item.domainName}`}
                              target="_blank"
                            >
                              <span>{item.domainName}</span>
                              <svg
                                className="relative top-px"
                                height="16"
                                strokeLinejoin="round"
                                viewBox="0 0 16 16"
                                width="16"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                ></path>
                              </svg>
                            </Link>
                          </td>
                          <td className="h-10 px-4 text-left">
                            <div className="items-center flex">
                              {item.IPAddress}
                            </div>
                          </td>
                          <td className="h-10 px-4 text-left">
                            <Link
                              className="gap-x-0.5 hover:text-[#171717] items-center transition-colors duration-200 flex"
                              href={`/providers/${toSlug(
                                item.hostingProvider
                              )}`}
                            >
                              <span>{item.hostingProvider}</span>
                              <svg
                                className="relative top-px"
                                height="16"
                                strokeLinejoin="round"
                                viewBox="0 0 16 16"
                                width="16"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                ></path>
                              </svg>
                            </Link>
                          </td>
                          <td className="h-10 px-4 text-left">
                            <div className="items-center flex">
                              {item.globalRanking}
                            </div>
                          </td>
                        </tr>
                      ))
                    : Array.from({ length: 50 }).map((_, index) => (
                        <tr className="border-t border-[#ebebeb]" key={index}>
                          <td className="h-10 px-4 text-left">
                            <div className="items-center flex">
                              <div className="animate-skeleton bg-[length:400%_100%] rounded-md w-28 h-5 bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)]"></div>
                            </div>
                          </td>
                          <td className="h-10 px-4 text-left">
                            <div className="items-center flex">
                              <div className="animate-skeleton bg-[length:400%_100%] rounded-md w-20 h-5 bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)]"></div>
                            </div>
                          </td>
                          <td className="h-10 px-4 text-left">
                            <div className="items-center flex">
                              <div className="animate-skeleton bg-[length:400%_100%] rounded-md w-28 h-5 bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)]"></div>
                            </div>
                          </td>
                          <td className="h-10 px-4 text-left">
                            <div className="items-center flex">
                              <div className="animate-skeleton bg-[length:400%_100%] rounded-md w-20 h-5 bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)]"></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center border-[#ebebeb] px-4 border-t h-10">
              {pagesCount && page <= pagesCount ? (
                <span className="text-xs">
                  {page} of {pagesCount}
                </span>
              ) : (
                <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] rounded-md w-20 h-4 animate-skeleton"></div>
              )}
              <div className="flex gap-x-2">
                <button
                  className={`flex justify-center items-center bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#ebebeb] rounded-[4px] w-6 h-6 ${
                    page <= 1 ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={page <= 1 ? true : false}
                  onClick={() => handlePageUpdate("prev")}
                >
                  <svg
                    className="h-2.5 text-[#8f8f8f]"
                    height="16"
                    strokeLinejoin="round"
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
                <button
                  className={`flex justify-center items-center bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#ebebeb] rounded-[4px] w-6 h-6 ${
                    pagesCount
                      ? page >= pagesCount
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  disabled={
                    pagesCount ? (page >= pagesCount ? true : false) : true
                  }
                  onClick={() => handlePageUpdate("next")}
                >
                  <svg
                    className="h-2.5 text-[#8f8f8f]"
                    height="16"
                    strokeLinejoin="round"
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
