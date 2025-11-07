"use client";
import React from "react";
import RequireAuth from "../auth/RequireAuth";
import Header from "../navigation/Header";
import AccountSidebar from "../AccountSidebar";
import Footer from "../navigation/Footer";

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
