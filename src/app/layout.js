"use client";

import { useState } from "react";
import "./globals.css";
import { geistSans } from "./fonts";
import { Context } from "./context";
import Header from "@/components/header";
import ContactModal from "@/components/contact-modal";
import PurchaseModal from "@/components/purchase-modal";
import Footer from "@/components/footer";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`box-border text-[#666] text-sm antialiased ${
          geistSans.className
        } ${menuOpen ? "overflow-hidden lg:overflow-auto" : ""} ${
          filterDropdownOpen ? "overflow-hidden sm:overflow-auto" : ""
        } ${contactModalOpen ? "overflow-hidden" : ""} ${
          purchaseModalOpen ? "overflow-hidden" : ""
        }`}
      >
        <Context.Provider
          value={{
            menuOpen,
            setMenuOpen,
            filterDropdownOpen,
            setFilterDropdownOpen,
            contactModalOpen,
            setContactModalOpen,
            purchaseModalOpen,
            setPurchaseModalOpen,
          }}
        >
          <Header />
          <ContactModal />
          <PurchaseModal />
          {children}
          <Footer />
        </Context.Provider>
      </body>
    </html>
  );
}
