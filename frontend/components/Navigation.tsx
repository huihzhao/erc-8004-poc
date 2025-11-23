"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/agents", label: "Agents" },
    { href: "/services", label: "Services" },
    { href: "/jurors", label: "Jurors" },
    { href: "/validations", label: "Validations" },
    { href: "/disputes", label: "Disputes" },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            ERC-8004
                        </Link>
                        <div className="flex space-x-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
