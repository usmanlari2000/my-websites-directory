"use client";

import { formatDate } from "@/utils";

export default function OtherDirectoryFallback({ hostingProvider }) {
  const today = new Date();
  const formattedDate = formatDate(today);

  return (
    <main className="bg-[#fafafa]">
      <div className="border-[#00000014] border-b">
        <div className="mx-auto px-4 py-10 max-w-screen-lg">
          <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="font-medium text-[#171717] text-[32px] leading-10">
              {hostingProvider.name} Hosted Websites Directory
            </h1>
            <time
              dateTime={today.toISOString().split("T")[0]}
              className="lg:inline hidden text-[#171717]"
            >
              {formattedDate}
            </time>
          </div>
          <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] mb-4 lg:mb-0 rounded-md w-full h-5 animate-skeleton"></div>
          <time
            dateTime={today.toISOString().split("T")[0]}
            className="inline lg:hidden text-[#171717]"
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
                      <span className="font-medium">Domain Name</span>
                      <button>
                        <svg
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          className="opacity-50 w-4 h-2"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <svg
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          className="opacity-50 w-4 h-2"
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
                      <span className="font-medium">IP Address</span>
                      <button>
                        <svg
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          className="opacity-50 w-4 h-2"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <svg
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          className="opacity-50 w-4 h-2"
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
                      <span className="font-medium">Global Ranking</span>
                      <button>
                        <svg
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          className="opacity-100 w-4 h-2"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.93935 10.5L2.46968 9.96966L7.2929 5.14644C7.68342 4.75592 8.31659 4.75592 8.70711 5.14644L13.5303 9.96966L14.0607 10.5L13 11.5607L12.4697 11.0303L8 6.56065L3.53034 11.0303L3.00001 11.5607L1.93935 10.5Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <svg
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          className="opacity-50 w-4 h-2"
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
                {Array.from({ length: 50 }).map((_, index) => (
                  <tr key={index} className="border-[#ebebeb] border-t">
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
            <div className="bg-[linear-gradient(270deg,#fafafa,#eaeaea,#eaeaea,#fafafa)] bg-[length:400%_100%] rounded-md w-20 h-4 animate-skeleton"></div>
            <div className="flex gap-x-2">
              <button
                disabled={false}
                className="flex justify-center items-center bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#ebebeb] rounded-[4px] w-6 h-6"
              >
                <svg
                  height="16"
                  strokeLinejoin="round"
                  viewBox="0 0 16 16"
                  width="16"
                  className="h-2.5 text-[#8f8f8f]"
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
                disabled={false}
                className="flex justify-center items-center bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#ebebeb] rounded-[4px] w-6 h-6"
              >
                <svg
                  height="16"
                  strokeLinejoin="round"
                  viewBox="0 0 16 16"
                  width="16"
                  className="h-2.5 text-[#8f8f8f]"
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
