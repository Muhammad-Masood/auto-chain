import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { NavLink } from "./types"
import { Poppins } from "next/font/google"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const navbarLinks: NavLink[] = [
  {
    name: "Explore",
    href: "/explore"
  },
  {
    name: "Rent",
    href: "/rent"
  },
  {
    name: "My Garage",
    href: "/garage"
  }
] 

export const poppins:any = Poppins({
  weight: "700",
  subsets: ["latin"],
});