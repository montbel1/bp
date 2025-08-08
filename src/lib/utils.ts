import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCompanyTitle(companyName?: string, companyType?: string) {
  const name = companyName || 'Avanee Books Pro'
  return name
}

export function getPageTitle(pageName: string, companyName?: string, companyType?: string) {
  const companyTitle = getCompanyTitle(companyName, companyType)
  return `${pageName} - ${companyTitle}`
}
