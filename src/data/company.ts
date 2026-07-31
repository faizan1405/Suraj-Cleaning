import { readJsonFile } from "@/lib/db";
import { business, contact } from "@/config/site";

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

/**
 * Read company info from the data layer (MongoDB with JSON fallback).
 * This replaces the previous internal fetch() which broke during static
 * generation because it depended on a live database connection.
 */
export async function getCompany(): Promise<CompanyInfo> {
  try {
    const data = await readJsonFile<any>("company.json");
    if (data && data.name) {
      return data as CompanyInfo;
    }
    throw new Error("No company data found");
  } catch (err) {
    console.error("Error fetching company, returning default:", err instanceof Error ? err.message : err);
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
