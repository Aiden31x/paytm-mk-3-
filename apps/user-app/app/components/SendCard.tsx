"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/Center";
import { TextInput } from "@repo/ui/TextInput";
import { useState } from "react";
import { p2pTransfer } from "../lib/actions/p2pTransfer";

interface SendCardProps {
    onTransactionComplete?: () => void;
}

export default function SendCard({ onTransactionComplete }: SendCardProps) {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");

    const handleTransactionSuccess = async () => {
        // Your transaction logic here
        // After successful transaction:
        try {
            // ... your transaction API call
            console.log("Transaction successful");
            onTransactionComplete?.(); // Call the callback to refresh transactions
        } catch (error) {
            console.error("Transaction failed:", error);
        }
    };

    return <div className="h-[90vh]">
        <Center>
            <Card title="send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            try {
                                await p2pTransfer(number, Number(amount) * 100);
                                console.log("Transaction successful");
                                onTransactionComplete?.(); // Call the callback to refresh transactions
                                setNumber(""); // Clear form
                                setAmount(""); // Clear form
                            } catch (error) {
                                console.error("Transaction failed:", error);
                                // Handle error (show toast, etc.)
                            }
                        }}>Send</Button>
                    </div>
                </div>
            </Card>
        </Center>

    </div>
}