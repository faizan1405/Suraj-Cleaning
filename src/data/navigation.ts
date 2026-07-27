export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Distributor", href: "/distributor" },
  { label: "Contact Us", href: "/contact" },
];
