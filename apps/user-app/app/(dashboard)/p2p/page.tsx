

import { PrismaClient } from "@prisma/client";
import { P2pTransactions } from "../../components/p2pTransaction";
import SendCard from "../../components/SendCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";



const prisma = new PrismaClient();
async function getTransactions() {
    const session = await getServerSession(authOptions);
    const transaction = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return transaction.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        from: t.fromUserId,
        to: t.toUserId
    }
    ));
}
export default async function () {
    const txn = await getTransactions();
    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2p Transaction
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard />
            </div>
            <div>
                <P2pTransactions transactions={txn} />
            </div>
        </div>
    </div>
}