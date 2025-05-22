"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconShoppingBagPlus,
  IconShoppingCart,
  IconShoppingCartPlus,
  IconUserBolt,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function SidebarMenu({ open, setOpen }) {
  const links = [
    {
      label: "add product",
      href: "../../../../marcket_place/add-product",
      icon: (
        <IconShoppingBagPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Profile",
      href: "../../../user",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: " home",
      href: "../../../../home",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <Image
                  src="/hamspng"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => (
  <Link
    href="../../../../marcket_place"
    className="font-normal flex space-x-2 items-center text-sm text-[#006D77] py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-[#006D77] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-[#006D77] whitespace-pre"
    >
      Market Place
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link
    href="../../../../marcket_place"
    className="font-normal flex space-x-2 items-center text-sm text-[#006D77] py-1 relative z-20"
  >
    <div className="h-5 w-6 bg-[#006D77] rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);
