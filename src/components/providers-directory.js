"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatDate, toSlug } from "@/utils";
import Link from "next/link";

export default function ProvidersDirectory() {
  const today = new Date();
  const formattedDate = formatDate(today);

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const sortParam = searchParams.get("sort") || "name";
  const sort = ["name", "knownIPsCount", "knownWebsitesCount"].includes(
    sortParam
  )
    ? sortParam
    : "name";

  const orderParam = searchParams.get("order") || "asc";
  const order = ["asc", "desc"].includes(orderParam) ? orderParam : "asc";

  const pageParam = Number(searchParams.get("page") || "1");
  const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

  const router = useRouter();

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
  const [pagesCount, setPagesCount] = useState(0);

  useEffect(() => {
    setHostingProviders([]);
    setPagesCount(0);

    const handleFetch = async () => {
      try {
        const url = new URL("/api/providers", window.location.origin);

        url.searchParams.append("sort", sort);
        url.searchParams.append("order", order);
        url.searchParams.append("page", page.toString());

        const res = await fetch(url.toString());

        if (!res.ok) {
          throw new Error();
        }

        const { hostingProviders, pagesCount } = await res.json();

        setHostingProviders(hostingProviders);
        setRecordsCount(hostingProviders.length);
        setPagesCount(pagesCount);
      } catch {
        console.log("Failed to fetch");
      }
    };

    handleFetch();
  }, [sort, order, page]);

  return (
    <main className="bg-[#fafafa]">
      <div className="border-[#00000014] border-b">
        <div className="mx-auto px-4 py-10 max-w-screen-lg">
          <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="font-medium text-[#171717] text-[32px] leading-10">
              Hosting Providers Directory
            </h1>
            <time
              className="lg:inline hidden text-[#171717]"
              dateTime={today.toISOString().split("T")[0]}
            >
              {formattedDate}
            </time>
          </div>
          {recordsCount ? (
            <p className="mb-4 lg:mb-0">
              This directory lists {recordsCount.toLocaleString()} hosting
              providers from around the world, along with their known IPs count,
              and known websites count. You can sort the list by hosting
              provider, known IPs count, or known websites count in either
              ascending or descending order. The data is regularly updated to
              ensure accuracy.
            </p>
          ) : (
            <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] mb-4 lg:mb-0 rounded-md w-full h-5 animate-skeleton"></div>
          )}
          <time
            className="inline lg:hidden text-[#171717]"
            dateTime={today.toISOString().split("T")[0]}
          >
            {formattedDate}
          </time>
        </div>
      </div>
      <div className="mx-auto px-4 py-6 max-w-screen-lg">
        <div className="border-[#ebebeb] border rounded-lg">
          <div className="overflow-auto">
            <table className="table-fixed w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="px-4 h-10 text-left">
                    <div className="flex items-center gap-x-2">
                      <span className="font-medium">Hosting Provider</span>
                      <button
                        className="cursor-pointer"
                        onClick={() => handleSortUpdate("name")}
                      >
                        <svg
                          className={`w-4 h-2 ${
                            sort === "name" && order === "asc"
                              ? ""
                              : "opacity-50"
                          }`}
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <svg
                          className={`w-4 h-2 ${
                            sort === "name" && order === "desc"
                              ? ""
                              : "opacity-50"
                          }`}
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
                    </div>
                  </th>
                  <th className="px-4 h-10 text-left">
                    <div className="flex items-center gap-x-2">
                      <span className="font-medium">Known IPs Count</span>
                      <button
                        className="cursor-pointer"
                        onClick={() => handleSortUpdate("knownIPsCount")}
                      >
                        <svg
                          className={`w-4 h-2 ${
                            sort === "knownIPsCount" && order === "asc"
                              ? ""
                              : "opacity-50"
                          }`}
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <svg
                          className={`w-4 h-2 ${
                            sort === "knownIPsCount" && order === "desc"
                              ? ""
                              : "opacity-50"
                          }`}
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
                    </div>
                  </th>
                  <th className="px-4 h-10 text-left">
                    <div className="flex items-center gap-x-2">
                      <span className="font-medium">Known Websites Count</span>
                      <button
                        className="cursor-pointer"
                        onClick={() => handleSortUpdate("knownWebsitesCount")}
                      >
                        <svg
                          className={`w-4 h-2 ${
                            sort === "knownWebsitesCount" && order === "asc"
                              ? ""
                              : "opacity-50"
                          }`}
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <svg
                          className={`w-4 h-2 ${
                            sort === "knownWebsitesCount" && order === "desc"
                              ? ""
                              : "opacity-50"
                          }`}
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
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {hostingProviders.length
                  ? hostingProviders.map((item, index) => (
                      <tr className="border-[#ebebeb] border-t" key={index}>
                        <td className="px-4 h-10 text-left">
                          <Link
                            className="flex items-center gap-x-0.5 hover:text-[#171717] transition-colors duration-200"
                            href={`/providers/${toSlug(item.name)}`}
                          >
                            <span>{item.name}</span>
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
                                d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </Link>
                        </td>
                        <td className="px-4 h-10 text-left">
                          <div className="flex items-center">
                            {item.knownIPsCount}
                          </div>
                        </td>
                        <td className="px-4 h-10 text-left">
                          <div className="flex items-center">
                            {item.knownWebsitesCount}
                          </div>
                        </td>
                      </tr>
                    ))
                  : Array.from({ length: 50 }).map((_, index) => (
                      <tr className="border-[#ebebeb] border-t" key={index}>
                        <td className="px-4 h-10 text-left">
                          <div className="flex items-center">
                            <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] rounded-md w-28 h-5 animate-skeleton"></div>
                          </div>
                        </td>
                        <td className="px-4 h-10 text-left">
                          <div className="flex items-center">
                            <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] rounded-md w-20 h-5 animate-skeleton"></div>
                          </div>
                        </td>
                        <td className="px-4 h-10 text-left">
                          <div className="flex items-center">
                            <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] rounded-md w-20 h-5 animate-skeleton"></div>
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
    </main>
  );
}
