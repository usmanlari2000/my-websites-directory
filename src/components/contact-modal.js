"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { Context } from "@/app/context";

export default function ContactModal() {
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
    message: "",
  });
  const [error, setError] = useState({
    fullName: false,
    emailAddress: false,
    message: false,
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
  const [contactToastVisible, setContactToastVisible] = useState(false);

  const { contactModalOpen, setContactModalOpen } = useContext(Context);

  const handleSubmit = async () => {
    const trimmedData = {
      fullName: data.fullName.trim(),
      emailAddress: data.emailAddress.trim(),
      message: data.message.trim(),
    };

    let isValid = true;
    const newError = {
      fullName: !trimmedData.fullName,
      emailAddress: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedData.emailAddress
      ),
      message: !trimmedData.message,
    };

    setError(newError);

    isValid = !Object.values(newError).some((item) => item);

    if (!isValid) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      if (!res.ok) {
        throw new Error();
      }

      setData({ fullName: "", emailAddress: "", message: "" });
      setSubmitting(false);
      setContactModalOpen(false);
      setContactToastVisible(true);
    } catch {
      console.log("Failed to submit");
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
    if (contactToastVisible) {
      const timer = setTimeout(() => {
        setContactToastVisible(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [contactToastVisible]);

  return (
    <>
      <div
        className={`top-0 left-0 z-30 fixed bg-[#0006] sm:bg-white w-full h-full transition-opacity duration-200 ${
          contactModalOpen ? "sm:opacity-80" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setContactModalOpen(false)}
      ></div>
      <div
        className={`sm:block top-1/2 left-1/2 z-40 fixed hidden bg-white shadow-[0px_0px_0px_1px_#00000014,0px_1px_1px_0px_#00000005,0px_4px_8px_-4px_#0000000a,0px_16px_24px_-8px_#0000000f] rounded-xl w-[500px] h-fit max-h-[min(520px,75%)] transition-[opacity,transform] -translate-x-1/2 -translate-y-1/2 duration-200 overflow-auto ${
          contactModalOpen ? "" : "opacity-0 pointer-events-none scale-90"
        }`}
        ref={desktopModalRef}
      >
        <div className="p-6">
          <h2 className="mb-6 font-semibold text-[#171717] text-2xl">
            Contact Us
          </h2>
          <p className="text-[#7d7d7d]">
            If you have any questions, feel free to reach out to us.
          </p>
        </div>
        <div className="bg-[#fafafa] p-6 border-[#ebebeb] border-t">
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
          <label htmlFor="message">Message</label>
          <textarea
            className={`bg-white block mt-2 px-3 py-2.5 rounded-md w-full text-[#171717] focus:outline-0 resize-none ${
              error.message
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029]"
            }`}
            id="message"
            name="message"
            value={data.message}
            placeholder="Hey, I wanted to ask about..."
            rows={6}
            onChange={handleChange}
          ></textarea>
          <div
            className={error.message ? "flex items-center gap-x-2" : "hidden"}
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
              The message is required
            </span>
          </div>
        </div>
        <div
          className="bottom-0 sticky flex justify-between p-4 border-[#ebebeb] border-t"
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
            onClick={() => setContactModalOpen(false)}
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
          contactModalOpen ? "" : "translate-y-full"
        }`}
        ref={mobileModalRef}
      >
        <div className="p-6">
          <h2 className="mb-6 font-semibold text-[#171717] text-2xl">
            Contact Us
          </h2>
          <p className="text-[#7d7d7d]">
            If you have any questions, feel free to reach out to us.
          </p>
        </div>
        <div className="bg-[#fafafa] p-6 border-[#ebebeb] border-t">
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
          <label htmlFor="message">Message</label>
          <textarea
            className={`bg-white block mt-2 px-3 py-2.5 rounded-md w-full text-[#171717] focus:outline-0 resize-none ${
              error.message
                ? "shadow-[0px_0px_0px_1px_#cb2a2f,0px_0px_0px_4px_#ffe6e6] mb-4"
                : "shadow-[0px_0px_0px_1px_#00000014] focus:shadow-[0px_0px_0px_1px_#00000056,0px_0px_0px_4px_#00000029]"
            }`}
            id="message"
            name="message"
            value={data.message}
            placeholder="Hey, I wanted to ask about..."
            rows={6}
            onChange={handleChange}
          ></textarea>
          <div
            className={error.message ? "flex items-center gap-x-2" : "hidden"}
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
              The message is required
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
            onClick={() => setContactModalOpen(false)}
          >
            Close
          </button>
          <button
            className={`cursor-pointer flex items-center gap-x-2 px-4 rounded-md h-10 font-medium transition-[background-color,color,box-shadow] duration-200 ${
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
          contactToastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        }
      `}
      >
        <div className="h-8 flex items-center justify-between">
          <p className="text-white font-medium">
            Your message has been sent successfully.
          </p>
          <button className="cursor-pointer h-full w-8 flex justify-center items-center rounded-md hover:bg-[#0067dc] transition-colors duration-200">
            <svg
              className="text-white"
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              onClick={() => setContactToastVisible(false)}
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
