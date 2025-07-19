import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";

const client= new PrismaClient()

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (session.user) {
        return NextResponse.json({
            user: session.user
        })
    }
    return NextResponse.json({
        message: "You are not logged in"
    }, {
        status: 403
    })
}