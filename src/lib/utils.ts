import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { NavLink } from "./types"

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
  }
] 