"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { PrismaClient } from "@prisma/client";

export async function createOnRampTxn(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString();
    const userId = session.user.id;
    if (!userId) {
        return {
            message: "User not logged in!"
        }
    }
    const prisma = new PrismaClient();
    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            amount,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
        }
    })

    return {
        message: "OnRamp transaction created successfully",
    }
}