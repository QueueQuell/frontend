"use client";
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AccountSidebar from "./AccountSidebar";
import RequireAuth from "./RequireAuth";

type Props = {
    children: React.ReactNode;
};

export default function AccountLayout({ children }: Props) {
    return (
        <RequireAuth>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header />
                <div style={{ display: "flex", flex: 1, alignItems: "stretch" }}>
                    <AccountSidebar />
                    <main style={{ flex: 1, padding: 20 }}>
                        {children}
                    </main>
                </div>
                <Footer />
            </div>
        </RequireAuth>
    );
}
