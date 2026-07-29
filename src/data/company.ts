export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  phoneRaw: string;
  phone2?: string;
  phone2Raw?: string;
  email: string;
  hours: string;
  social: {
    whatsapp: string;
  };
  stats: {
    customers: number;
    distributors: number;
    products: number;
    years: number;
  };
}

import { business, contact } from "@/config/site";

let cachedCompany: CompanyInfo | null = null;

export async function getCompany(): Promise<CompanyInfo> {
  // Always re-fetch so admin settings changes are visible immediately.
  // The previous in-memory cache caused stale data after saves.
  try {
    const res = await fetch("/api/admin/data/company", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch company");
    return await res.json();
  } catch {
    console.error("Error fetching company, returning default");
    return {
      name: business.name,
      tagline: business.tagline,
      description: business.description,
      address: contact.address,
      phone: contact.phone,
      phoneRaw: contact.phoneRaw,
      phone2: contact.phone2,
      phone2Raw: contact.phone2Raw,
      email: contact.email,
      hours: contact.hours,
      social: { whatsapp: `https://wa.me/${contact.phoneRaw}` },
      stats: { customers: 500, distributors: 100, products: 25, years: 5 },
    };
  }
}

export function clearCompanyCache() {
  cachedCompany = null;
}
