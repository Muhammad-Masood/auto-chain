"use client";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { navbarLinks } from "@/lib/utils";
import { NavLink } from "@/lib/types";
import { ConnectWallet } from "@thirdweb-dev/react";
import localFont from "next/font/local";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const dash = localFont({ src: "./Dashhorizon-eZ5wg.otf" });

const NavBar = () => {
  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-3">
        {/* Logo  */}
        <Disclosure>
          {({ open }) => (
            <>
              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto">
                <Link href="/">
                  <span className="flex items-center space-x-2">
                    <span className="">
                      <Image
                        src="/logo.png"
                        alt="N"
                        width="32"
                        height="32"
                        className="w-8"
                      />
                    </span>
                    <span
                      className={`${dash.className} tracking-wider text-3xl pb-3 `}
                    >
                      AutoChain
                    </span>
                  </span>
                </Link>

                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:text-gray-300 dark:focus:bg-trueGray-700"
                >
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    {open && (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    )}
                    {!open && (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-col w-full my-5 lg:hidden">
                  {navbarLinks.map((item: NavLink, index: number) => (
                    <div key={index} className="mb-3">
                      {item.name !== "Rent" ? (
                        <Link
                          href={item.href}
                          className="block px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none duration-300"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <HoverCard>
                          <HoverCardTrigger>
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none duration-300"
                            >
                              {item.name}
                            </Link>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            <Link
                              href="/list"
                              className="block px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 duration-300"
                            >
                              List Car
                            </Link>
                            <Link
                              href="/rent"
                              className="block px-4 py-2 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 duration-300"
                            >
                              Rent Car
                            </Link>
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </div>
                  ))}
                  <ConnectWallet
                    theme="dark"
                    modalSize="wide"
                    className="block px-6 py-2 text-white bg-indigo-600 rounded-md mt-3 md:ml-5"
                  />
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>

        {/* menu  */}
        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-6 list-none lg:pt-0 lg:flex">
            {navbarLinks.map((menu: NavLink, index: number) => (
              <li className="mr-3 nav__item" key={index}>
                {menu.name !== "Rent" ? (
                  <Link
                    href={menu.href}
                    className="inline-block px-4 py-2 text-lg font-normal text-gray-800 no-underline rounded-md dark:text-gray-200 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none dark:focus:bg-gray-800 duration-300"
                  >
                    {menu.name}
                  </Link>
                ) : (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 dark:focus:bg-gray-800 focus:outline-none duration-300 cursor-pointer">
                        {menu.name}
                      </p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <Link
                        href={"/list"}
                        className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500  duration-300"
                      >
                        List Car
                      </Link>
                      <Link
                        href={"/rent"}
                        className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md dark:text-gray-300 hover:text-indigo-500 focus:text-indigo-500    duration-300"
                      >
                        Rent Car
                      </Link>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden mr-3 space-x-4 lg:flex nav__item">
          <ConnectWallet
            theme={"dark"}
            modalSize={"wide"}
            className="!px-6 !py-2 !text-white !bg-indigo-600 !rounded-md !md:ml-5"
          />
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
