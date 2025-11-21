"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/home/Footer";

export default function LocaleLayout({ children, params }) {
	const pathname = usePathname();
	const isContactPage = pathname?.includes("/contact");

	return (
		<>
			{!isContactPage && <Navbar />}
			{children}
			{!isContactPage && <Footer />}
		</>
	);
}
