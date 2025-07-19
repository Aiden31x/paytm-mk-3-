import express from "express";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const app = express();

// Add JSON body parser middleware
app.use(express.json());

// Optional: Add URL encoded parser if needed
app.use(express.urlencoded({ extended: true }));

app.post("/hdfcWebhook", async (req, res) => {
    // Add logging to debug the request
    console.log("Received webhook request:", {
        body: req.body,
        headers: req.headers
    });

    // Validate that required fields exist
    if (!req.body || !req.body.token || !req.body.user_identifier || !req.body.amount) {
        console.error("Missing required fields in webhook request");
        return res.status(400).json({
            message: "Missing required fields: token, user_identifier, amount"
        });
    }

    // TODO: Add zod validation here?
    // TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string;
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    console.log("Processing payment information:", paymentInformation);

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        console.log("Transaction completed successfully");

        res.json({
            message: "Captured"
        });
    } catch (e) {
        console.error("Database transaction error:", e);
        res.status(411).json({
            message: "Error while processing webhook"
        });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

app.listen(3003, () => {
    console.log("Webhook server running on port 3003");
});