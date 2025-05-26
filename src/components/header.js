"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Context } from "@/app/context";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  const { menuOpen, setMenuOpen, setContactModalOpen, setPurchaseModalOpen } =
    useContext(Context);

  return (
    <header className="bg-white shadow-[inset_0px_-1px_0px_#00000014] sticky z-20 -top-px">
      <div
        className={`max-w-screen-lg mx-auto px-4 ${
          menuOpen ? "h-screen lg:h-fit" : ""
        }`}
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-x-4">
            <Link
              className="flex font-medium h-10 items-center text-[#171717]"
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              MyWebsitesDirectory
            </Link>
            <Link
              className={`duration-200 h-10 hidden items-center lg:flex transition-colors ${
                pathname === "/providers"
                  ? "text-[#171717]"
                  : "hover:text-[#171717]"
              }`}
              href="/providers"
            >
              Hosting Providers
            </Link>
          </div>
          <div className="flex items-center gap-x-4">
            <button
              className="cursor-pointer duration-200 h-10 hidden hover:text-[#171717] lg:inline transition-colors"
              onClick={() => {
                setContactModalOpen(true);
                setMenuOpen(false);
              }}
            >
              Contact Us
            </button>
            <button
              className="cursor-pointer bg-[#171717] duration-200 font-medium h-10 hidden hover:bg-[#383838] items-center lg:flex px-4 rounded-md shadow-[0px_0px_0px_1px_#00000000] text-white transition-colors"
              onClick={() => {
                setPurchaseModalOpen(true);
                setMenuOpen(false);
              }}
            >
              Purchase Data
            </button>
          </div>
          <button
            className="cursor-pointer border border-[#00000014] flex flex-col h-8 items-center justify-center lg:hidden rounded-full w-8"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div
              className={`bg-[#666] duration-200 h-[1.5px] transition-transform w-[14px] ${
                menuOpen
                  ? "translate-y-[0.5px] rotate-45 scale-x-110"
                  : "translate-y-[-2.75px]"
              }`}
            ></div>
            <div
              className={`bg-[#666] duration-200 h-[1.5px] transition-transform w-[14px] ${
                menuOpen
                  ? "translate-y-[-0.5px] -rotate-45 scale-x-110"
                  : "translate-y-[2.75px]"
              }`}
            ></div>
          </button>
        </div>
        <div
          className={`border-b flex flex-col gap-y-3 border-[#ebebeb] lg:hidden py-3 ${
            menuOpen ? "" : "hidden"
          }`}
        >
          <button
            className="cursor-pointer bg-[#171717] duration-200 flex h-10 hover:bg-[#383838] items-center justify-center px-4 rounded-md shadow-[0px_0px_0px_1px_#00000000] text-white font-medium transition-colors"
            onClick={() => {
              setPurchaseModalOpen(true);
              setMenuOpen(false);
            }}
          >
            Purchase Data
          </button>
          <div>
            <Link
              className={`duration-200 flex h-10 items-center transition-colors w-fit ${
                pathname === "/providers"
                  ? "text-[#171717]"
                  : "hover:text-[#171717]"
              }`}
              href="/providers"
              onClick={() => setMenuOpen(false)}
            >
              Hosting Providers
            </Link>
            <button
              className="cursor-pointer duration-200 flex h-10 hover:text-[#171717] items-center transition-colors"
              onClick={() => {
                setContactModalOpen(true);
                setMenuOpen(false);
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
