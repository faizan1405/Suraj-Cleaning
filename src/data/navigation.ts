export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export const navigation: NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Why Us", href: "#benefits" },
  { label: "Distributor", href: "#distributor" },
  { label: "Contact Us", href: "#contact" },
];
