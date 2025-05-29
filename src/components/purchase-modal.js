"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "@/app/context";
import { geistMono } from "@/app/fonts";

export default function PurchaseModal() {
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleScroll = (ref) => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current;
      const totalScrollable = scrollHeight - clientHeight;
      const scrollProgress = (scrollTop / totalScrollable) * 100;

      setScrollPercent(Math.min(Math.max(scrollProgress, 0), 100));
    }
  };

  const [data, setData] = useState({
    fullName: "",
    emailAddress: "",
    transactionID: "",
  });
  const [error, setError] = useState({
    fullName: false,
    emailAddress: false,
    transactionID: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({
      ...prev,
      [name]:
        name === "emailAddress"
          ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          : !value.trim(),
    }));
  };

  const [submitting, setSubmitting] = useState(false);
  const [purchaseToastVisible, setPurchaseToastVisible] = useState(false);

  const { purchaseModalOpen, setPurchaseModalOpen } = useContext(Context);

  const handleSubmit = async () => {
    const trimmedData = {
      fullName: data.fullName.trim(),
      emailAddress: data.emailAddress.trim(),
      transactionID: data.transactionID.trim(),
    };

    let isValid = true;
    const newError = {
      fullName: !trimmedData.fullName,
      emailAddress: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedData.emailAddress
      ),
      transactionID: !trimmedData.transactionID,
    };

    setError(newError);

    isValid = !Object.values(newError).some((item) => item);

    if (!isValid) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      if (!res.ok) {
        throw new Error();
      }

      setData({
        fullName: "",
        emailAddress: "",
        transactionID: "",
      });
      setSubmitting(false);
      setPurchaseToastVisible(true);
      setPurchaseModalOpen(false);
    } catch {
      console.log("Failed to submit");
    }
  };

  const [USDTCopied, setUSDTCopied] = useState(false);

  const handleUSDTCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        "0xa1272120050a09814f93962ce3bfd20bf2653965"
      );

      setUSDTCopied(true);

      setTimeout(() => setUSDTCopied(false), 1000);
    } catch {
      console.log("Failed to copy");
    }
  };

  const [BNBCopied, setBNBCopied] = useState(false);

  const handleBNBCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        "0xe16da609d75c861291cbda458e85a3f696342776"
      );

      setBNBCopied(true);
      setTimeout(() => setBNBCopied(false), 1000);
    } catch {
      console.log("Failed to copy");
    }
  };

  const desktopModalRef = useRef();
  const mobileModalRef = useRef();

  useEffect(() => {
    const desktopModal = desktopModalRef.current;
    const mobileModal = mobileModalRef.current;

    const desktopScrollHandler = () => handleScroll(desktopModalRef);
    const mobileScrollHandler = () => handleScroll(mobileModalRef);

    desktopModal?.addEventListener("scroll", desktopScrollHandler);
    mobileModal?.addEventListener("scroll", mobileScrollHandler);

    return () => {
      desktopModal?.removeEventListener("scroll", desktopScrollHandler);
      mobileModal?.removeEventListener("scroll", mobileScrollHandler);
    };
  }, []);

  useEffect(() => {
    if (purchaseToastVisible) {
      const timer = setTimeout(() => {
        setPurchaseToastVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [purchaseToastVisible]);

  return (
    <>
      <div
        className={`top-0 left-0 z-30 fixed bg-[#0006] sm:bg-white w-full h-full transition-opacity duration-200 ${
          purchaseModalOpen ? "sm:opacity-80" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setPurchaseModalOpen(false)}
      ></div>
      <div
        className={`sm:block top-1/2 left-1/2 z-40 fixed hidden bg-white shadow-[0px_0px_0px_1px_#00000014,0px_1px_1px_0px_#00000005,0px_4px_8px_-4px_#0000000a,0px_16px_24px_-8px_#0000000f] rounded-xl w-[500px] h-fit max-h-[min(520px,75%)] transition-[opacity,transform] -translate-x-1/2 -translate-y-1/2 duration-200 overflow-auto ${
          purchaseModalOpen ? "" : "opacity-0 pointer-events-none scale-90"
        }`}
        ref={desktopModalRef}
      >
        <div className="p-6">
          <h2 className="mb-6 font-semibold text-[#171717] text-2xl">
            Purchase Data
          </h2>
          <p className="mb-6 text-[#7d7d7d]">
            Send <span className="font-medium text-[#171717]">50 USD</span> to
            any of the addresses listed below on the{" "}
            <span className="font-medium text-[#171717]">
              Binance Smart Chain (BEP20) network
            </span>{" "}
            and share the transaction ID with us. We will send you all the
            website data within one day.
          </p>
          <span className="text-[#7d7d7d]">USDT Address</span>
          <div className="flex justify-between gap-x-2 border-[#00000014] mt-2 mb-6 pl-3 border rounded-md h-10">
            <pre
              className={`flex items-center h-full text-[13px] overflow-auto scrollbar-hide ${geistMono.className}`}
            >
              0xa1272120050a09814f93962ce3bfd20bf2653965
            </pre>
            <button
              className="cursor-pointer relative flex items-center px-3 h-full"
              onClick={handleUSDTCopy}
            >
              <svg
                className={`transition-[opacity,transform] duration-200 ${
                  USDTCopied ? "" : "opacity-0 scale-50"
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                className={`absolute transition-[opacity,transform] duration-200 ${
                  USDTCopied ? "opacity-0 scale-50" : ""
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
          <span className="text-[#7d7d7d]">BNB Address</span>
          <div className="flex justify-between gap-x-2 border-[#00000014] mt-2 pl-3 border rounded-md h-10">
            <pre
              className={`flex items-center h-full text-[13px] overflow-auto scrollbar-hide ${geistMono.className}`}
            >
              0xe16da609d75c861291cbda458e85a3f696342776
            </pre>
            <button
              className="cursor-pointer relative flex items-center px-3 h-full"
              onClick={handleBNBCopy}
            >
              <svg
                className={`transition-[opacity,transform] duration-200 ${
                  BNBCopied ? "" : "opacity-0 scale-50"
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                className={`absolute transition-[opacity,transform] duration-200 ${
                  BNBCopied ? "opacity-0 scale-50" : ""
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="border-[#ebebeb] bg-[#fafafa] p-6 border-t">
          <label htmlFor="fullName">Full Name</label>
          <input
            className={`bg-white block mt-2 px-3 rounded-md w-full h-10 text-[#171717] focus:outline-0 ${
              error.fullName
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029] mb-6"
            }`}
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            placeholder="John Doe"
            onChange={handleChange}
          />
          <div
            className={`mb-6 ${
              error.fullName ? "flex items-center gap-x-2" : "hidden"
            }`}
          >
            <svg
              className="text-[#cb2a2f]"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[#cb2a2f] text-[13px]">
              The full name is required
            </span>
          </div>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            className={`bg-white block mt-2 px-3 rounded-md w-full h-10 text-[#171717] focus:outline-0 ${
              error.emailAddress
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029] mb-6"
            }`}
            type="text"
            id="emailAddress"
            name="emailAddress"
            value={data.emailAddress}
            placeholder="johndoe@outlook.com"
            onChange={handleChange}
          />
          <div
            className={`mb-6 ${
              error.emailAddress ? "flex items-center gap-x-2" : "hidden"
            }`}
          >
            <svg
              className="text-[#cb2a2f]"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[#cb2a2f] text-[13px]">
              {data.emailAddress === ""
                ? "The email address is required"
                : "The email address format is incorrect"}
            </span>
          </div>
          <label htmlFor="transactionID">Transaction ID</label>
          <input
            className={`bg-white block mt-2 px-3 rounded-md w-full h-10 text-[#171717] focus:outline-0 ${
              error.transactionID
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029]"
            }`}
            type="text"
            id="transactionID"
            name="transactionID"
            value={data.transactionID}
            placeholder="0xabc123def4567890fedcba0987654321abcdef1234567890abcdefabcdef1234"
            onChange={handleChange}
          />
          <div
            className={
              error.transactionID ? "flex items-center gap-x-2" : "hidden"
            }
          >
            <svg
              className="text-[#cb2a2f]"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[#cb2a2f] text-[13px]">
              The transaction ID is required
            </span>
          </div>
        </div>
        <div
          className="bottom-0 sticky flex justify-between border-[#ebebeb] p-4 border-t"
          style={{
            backgroundColor: `hsl(0, 0%, ${100 - scrollPercent / 50}%)`,
            boxShadow: `rgba(0, 0, 0, ${Math.max(
              0.5 - scrollPercent / 200,
              0
            )}) 0px 4px 8px 0px`,
          }}
        >
          <button
            className="cursor-pointer flex items-center bg-white hover:bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#00000014] px-4 rounded-md h-10 font-medium text-[#171717] transition-colors duration-200"
            onClick={() => setPurchaseModalOpen(false)}
          >
            Close
          </button>
          <button
            className={`flex items-center gap-x-2 px-4 rounded-md h-10 font-medium transition-[background-color,color,box-shadow] duration-200 ${
              submitting
                ? "bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#ebebeb] text-[#8f8f8f] cursor-not-allowed"
                : "bg-[#171717] hover:bg-[#383838] shadow-[0px_0px_0px_1px_#00000000] text-white cursor-pointer"
            }`}
            disabled={submitting}
            onClick={handleSubmit}
          >
            <div
              className={`relative top-2 left-2 w-4 h-4 ${
                submitting ? "" : "hidden"
              }`}
            >
              {Array.from({ length: 12 }).map((_, index) => {
                const angle = index * -30;
                const delay = -(index * 100);

                return (
                  <div
                    className="top-[-3.9%] left-[-10%] absolute bg-[#666] rounded-md w-[24%] h-[8%] animate-spinner"
                    key={index}
                    style={{
                      animationDelay: `${delay}ms`,
                      transform: `rotate(${angle}deg) translateX(146%)`,
                    }}
                  ></div>
                );
              })}
            </div>
            <span>Submit</span>
          </button>
        </div>
      </div>
      <div
        className={`-bottom-px z-40 fixed sm:hidden bg-white shadow-[0px_0px_0px_1px_#00000014,0px_1px_1px_0px_#00000005,0px_4px_8px_-4px_#0000000a,0px_16px_24px_-8px_#0000000f] rounded-t-lg w-full h-fit max-h-[min(520px,75%)] transition-transform duration-200 overflow-auto ${
          purchaseModalOpen ? "" : "translate-y-full"
        }`}
        ref={mobileModalRef}
      >
        <div className="p-6">
          <h2 className="mb-6 font-semibold text-[#171717] text-2xl">
            Purchase Data
          </h2>
          <p className="mb-6 text-[#7d7d7d]">
            Send <span className="font-medium text-[#171717]">50 USD</span> to
            any of the addresses listed below on the{" "}
            <span className="font-medium text-[#171717]">
              Binance Smart Chain (BEP20) network
            </span>{" "}
            and share the transaction ID with us. We will send you all the
            website data within one day.
          </p>
          <span className="text-[#7d7d7d]">USDT Address</span>
          <div className="flex justify-between gap-x-2 border-[#00000014] mt-2 mb-6 pl-3 border rounded-md h-10">
            <pre
              className={`flex items-center h-full text-[13px] overflow-auto scrollbar-hide ${geistMono.className}`}
            >
              0xa1272120050a09814f93962ce3bfd20bf2653965
            </pre>
            <button
              className="cursor-pointer relative flex items-center px-3 h-full"
              onClick={handleUSDTCopy}
            >
              <svg
                className={`absolute transition-[opacity,transform] duration-200 ${
                  USDTCopied ? "" : "opacity-0 scale-50"
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                className={`transition-[opacity,transform] duration-200 ${
                  USDTCopied ? "opacity-0 scale-50" : ""
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
          <span className="text-[#7d7d7d]">BNB Address</span>
          <div className="flex justify-between gap-x-2 border-[#00000014] mt-2 pl-3 border rounded-md h-10">
            <pre
              className={`flex items-center h-full text-[13px] overflow-auto scrollbar-hide ${geistMono.className}`}
            >
              0xe16da609d75c861291cbda458e85a3f696342776
            </pre>
            <button
              className="cursor-pointer relative flex justify-center items-center px-3 h-full"
              onClick={handleBNBCopy}
            >
              <svg
                className={`absolute transition-[opacity,transform] duration-200 ${
                  BNBCopied ? "" : "opacity-0 scale-50"
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                className={`transition-[opacity,transform] duration-200 ${
                  BNBCopied ? "opacity-0 scale-50" : ""
                }`}
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="16"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="border-[#ebebeb] p-6 bg-[#fafafa] border-t">
          <label htmlFor="fullName">Full Name</label>
          <input
            className={`bg-white block mt-2 px-3 rounded-md w-full h-10 text-[#171717] focus:outline-0 ${
              error.fullName
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029] mb-6"
            }`}
            type="text"
            id="fullName"
            name="fullName"
            value={data.fullName}
            placeholder="John Doe"
            autoComplete="off"
            onChange={handleChange}
          />
          <div
            className={`mb-6 ${
              error.fullName ? "flex items-center gap-x-2" : "hidden"
            }`}
          >
            <svg
              className="text-[#cb2a2f]"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[#cb2a2f] text-[13px]">
              The full name is required
            </span>
          </div>
          <label htmlFor="emailAddress">Email Address</label>
          <input
            className={`bg-white block mt-2 px-3 rounded-md h-10 w-full text-[#171717] focus:outline-0 ${
              error.emailAddress
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029] mb-6"
            }`}
            type="text"
            id="emailAddress"
            name="emailAddress"
            value={data.emailAddress}
            placeholder="johndoe@outlook.com"
            autoComplete="off"
            onChange={handleChange}
          />
          <div
            className={`mb-6 ${
              error.emailAddress ? "flex items-center gap-x-2" : "hidden"
            }`}
          >
            <svg
              className="text-[#cb2a2f]"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[#cb2a2f] text-[13px]">
              {data.emailAddress === ""
                ? "The email address is required"
                : "The email address format is incorrect"}
            </span>
          </div>
          <label htmlFor="transactionID">Transaction ID</label>
          <input
            className={`bg-white block mt-2 px-3 rounded-md w-full h-10 text-[#171717] focus:outline-0 ${
              error.transactionID
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029]"
            }`}
            type="text"
            id="transactionID"
            name="transactionID"
            value={data.transactionID}
            placeholder="0xabc123def4567890fedcba0987654321abcdef1234567890abcdefabcdef1234"
            onChange={handleChange}
          />
          <div
            className={
              error.transactionID ? "flex items-center gap-x-2" : "hidden"
            }
          >
            <svg
              className="text-[#cb2a2f]"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.30761 1.5L1.5 5.30761L1.5 10.6924L5.30761 14.5H10.6924L14.5 10.6924V5.30761L10.6924 1.5H5.30761ZM5.10051 0C4.83529 0 4.58094 0.105357 4.3934 0.292893L0.292893 4.3934C0.105357 4.58094 0 4.83529 0 5.10051V10.8995C0 11.1647 0.105357 11.4191 0.292894 11.6066L4.3934 15.7071C4.58094 15.8946 4.83529 16 5.10051 16H10.8995C11.1647 16 11.4191 15.8946 11.6066 15.7071L15.7071 11.6066C15.8946 11.4191 16 11.1647 16 10.8995V5.10051C16 4.83529 15.8946 4.58093 15.7071 4.3934L11.6066 0.292893C11.4191 0.105357 11.1647 0 10.8995 0H5.10051ZM8.75 3.75V4.5V8L8.75 8.75H7.25V8V4.5V3.75H8.75ZM8 12C8.55229 12 9 11.5523 9 11C9 10.4477 8.55229 10 8 10C7.44772 10 7 10.4477 7 11C7 11.5523 7.44772 12 8 12Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[#cb2a2f] text-[13px]">
              The transaction ID is required
            </span>
          </div>
        </div>
        <div
          className="bottom-0 sticky flex justify-between border-[#ebebeb] p-4 border-t"
          style={{
            backgroundColor: `hsl(0, 0%, ${100 - scrollPercent / 50}%)`,
            boxShadow: `rgba(0, 0, 0, ${Math.max(
              0.5 - scrollPercent / 200,
              0
            )}) 0px 4px 8px 0px`,
          }}
        >
          <button
            className="cursor-pointer flex items-center bg-white hover:bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#00000014] px-4 rounded-md h-10 font-medium text-[#171717] transition-colors duration-200"
            onClick={() => setPurchaseModalOpen(false)}
          >
            Close
          </button>
          <button
            className={`flex items-center gap-x-2 px-4 rounded-md h-10 font-medium transition-[background-color,color,box-shadow] duration-200 ${
              submitting
                ? "bg-[#f2f2f2] shadow-[0px_0px_0px_1px_#ebebeb] text-[#8f8f8f] cursor-not-allowed"
                : "bg-[#171717] hover:bg-[#383838] shadow-[0px_0px_0px_1px_#00000000] text-white cursor-pointer"
            }`}
            disabled={submitting}
            onClick={handleSubmit}
          >
            <div
              className={`relative top-2 left-2 w-4 h-4 ${
                submitting ? "" : "hidden"
              }`}
            >
              {Array.from({ length: 12 }).map((_, index) => {
                const angle = index * -30;
                const delay = -(index * 100);

                return (
                  <div
                    className="top-[-3.9%] left-[-10%] absolute bg-[#666] rounded-md w-[24%] h-[8%] animate-spinner"
                    key={index}
                    style={{
                      animationDelay: `${delay}ms`,
                      transform: `rotate(${angle}deg) translateX(146%)`,
                    }}
                  ></div>
                );
              })}
            </div>
            <span>Submit</span>
          </button>
        </div>
      </div>
      <div
        className={`fixed bottom-4 right-4 z-40 max-w-[min(420px,90%)] w-full p-4 rounded-xl bg-[#0072F5]
        shadow-[0px_0px_0px_1px_#00000014,_0px_1px_1px_0px_#00000005,_0px_4px_8px_-4px_#0000000a,_0px_16px_24px_-8px_#0000000f]
        transition-all duration-500
        ${
          purchaseToastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }
      `}
      >
        <div className="h-8 flex items-center justify-between">
          <p className="text-white font-medium">
            Thank You! You'll receive your data soon.
          </p>
          <button className="cursor-pointer h-full w-8 flex justify-center items-center rounded-md hover:bg-[#0067dc] transition-colors duration-200">
            <svg
              className="text-white"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              onClick={() => setPurchaseToastVisible(false)}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
