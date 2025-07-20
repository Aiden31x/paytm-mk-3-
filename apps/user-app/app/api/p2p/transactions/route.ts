// apps/user-app/app/api/p2p/transactions/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "apps/user-app/app/lib/auth";


const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json([], { status: 401 });
    }

    const transactions = await prisma.p2pTransfer.findMany({
        where: { fromUserId: Number(session.user.id) }
    });

    // Convert dates to ISO strings for consistent handling
    const formattedTransactions = transactions.map(t => ({
        time: t.timestamp.toISOString(), // Convert to string
        amount: t.amount,
        from: t.fromUserId,
        to: t.toUserId
    }));

    return NextResponse.json(formattedTransactions);
}