import "./globals.css";

import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {NextFont} from "next/dist/compiled/@next/font";
import React from "react";

import {Web3ModalProvider} from './context/Web3ModalProvider'


const inter: NextFont = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Hive Network - Agent UI",
    description: "UI for Hive Agents",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
        </body>
        </html>
    );
}
