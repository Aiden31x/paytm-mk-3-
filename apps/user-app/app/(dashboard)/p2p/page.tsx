"use client"
import { useEffect, useState } from "react";
import { P2pTransactions } from "../../components/p2pTransaction";
import SendCard from "../../components/SendCard";

export default function P2pPage() {
    const [transactions, setTransactions] = useState<{
        time: string;
        amount: number;
        from: number;
        to: number;
    }[]>([]);
    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/p2p/transactions");
            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    };
    useEffect(() => { fetchTransactions(); }, []);
    return (
        <div>
            <SendCard onTransactionComplete={fetchTransactions} />
            <P2pTransactions transactions={transactions} />
        </div>
    );
}