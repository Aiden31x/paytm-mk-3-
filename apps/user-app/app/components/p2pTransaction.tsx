"use client"
import { Card } from "@repo/ui/card"

export const P2pTransactions = ({
    transactions
}: {
    transactions: {
        time: string,
        amount: number,
        from: number,
        to: number
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    console.log(transactions)
    return (
        <div>
            <Card title="Recent Transactions">
                <div className="pt-2">
                    {transactions.map((t, index) => (
                        <div key={index} className="flex justify-between">
                            <div>
                                <div className="text-sm">
                                    Sent INR
                                </div>
                                <div className="text-slate-600 text-xs">
                                    {new Date(t.time).toDateString()}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                + Rs {t.amount / 100}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>)
}