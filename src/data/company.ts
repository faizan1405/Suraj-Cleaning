export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  phoneRaw: string;
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

let cachedCompany: CompanyInfo | null = null;

export async function getCompany(): Promise<CompanyInfo> {
  if (cachedCompany) return cachedCompany;

  try {
    const res = await fetch("/api/admin/data/company", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch company");
    cachedCompany = await res.json();
    return cachedCompany!;
  } catch {
    console.error("Error fetching company, returning default");
    cachedCompany = {
      name: "Swaraj Enterprises",
      tagline: "Clean Homes, Happy Lives",
      description: "Your trusted partner for premium cleaning solutions.",
      address: "Bantwala, Dakshina Kannada, Karnataka, India",
      phone: "+91 98447 34939",
      phoneRaw: "919844734939",
      email: "swarajenterprisesco@gmail.com",
      hours: "Mon - Sat: 9:00 AM - 7:00 PM",
      social: { whatsapp: "https://wa.me/919844734939" },
      stats: { customers: 500, distributors: 100, products: 25, years: 5 },
    };
    return cachedCompany;
  }
}

export function clearCompanyCache() {
  cachedCompany = null;
}
