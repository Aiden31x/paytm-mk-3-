import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const aliceHashedPassword = await bcrypt.hash('alice', 10);
    const bobHashedPassword = await bcrypt.hash('bob', 10);

    const alice = await prisma.user.upsert({
        where: { number: '9999999999' },
        update: {
            password: aliceHashedPassword,
            name: 'Alice',
        },
        create: {
            number: '9999999999',
            password: aliceHashedPassword,
            name: 'Alice',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Success",
                    amount: 20000,
                    token: "122",
                    provider: "HDFC BANK"
                },
            },
            Balance: {
                create: {
                    amount: 20000,
                    locked: 0
                }
            }
        },
    });

    const bob = await prisma.user.upsert({
        where: { number: '9999999998' },
        update: {
            password: bobHashedPassword,
            name: 'Bob',
        },
        create: {
            number: '9999999998',
            password: bobHashedPassword,
            name: 'Bob',
            OnRampTransaction: {
                create: {
                    startTime: new Date(),
                    status: "Failure",
                    amount: 2000,
                    token: "123",
                    provider: "HDFC Bank",
                },
            },
            Balance: {
                create: {
                    amount: 2000,
                    locked: 0
                }
            }
        },
    });

    // Also create balance records separately to ensure they exist
    await prisma.balance.upsert({
        where: { userId: alice.id },
        update: { amount: 20000, locked: 0 },
        create: {
            userId: alice.id,
            amount: 20000,
            locked: 0
        }
    });

    await prisma.balance.upsert({
        where: { userId: bob.id },
        update: { amount: 2000, locked: 0 },
        create: {
            userId: bob.id,
            amount: 2000,
            locked: 0
        }
    });

    console.log({ alice, bob });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });