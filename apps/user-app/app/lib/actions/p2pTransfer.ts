"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();
export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);


    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending message"
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    }
    );
    if (!toUser) {
        return {
            message: "User not found!"
        }
    }


    //making sure this whole acts as a transaction
    await prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"= ${Number(from)} FOR UPDATE`;         // locks the db for anu ypdate query coming saying that nothing else from here on now would get updated untill its completed(even for reading balance amount)
        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
        });
        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error("Insufficient funds!!")
        }

        await tx.balance.update({
            where: {
                userId: Number(from)
            },
            data: {
                amount: { decrement: amount }
            }
        });

        await tx.balance.update({
            where: {
                userId: Number(toUser.id)
            },
            data: {
                amount: { increment: amount }
            }
        })
    })



}