import { TransactionMessage, PublicKey, VersionedTransaction, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";

export async function createTransferTransaction(
    senderAddress: string,
    recipientAddress: string,
    amountLamports: number
) {
    // Convert addresses to PublicKeys
    const senderPublicKey = new PublicKey(senderAddress);
    const recipientPublicKey = new PublicKey(recipientAddress);

    // Create transfer instruction
    const instruction = SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: recipientPublicKey,
        lamports: amountLamports,
    });
    const message = new TransactionMessage({
        instructions: [instruction],
        recentBlockhash: "11111111111111111111111111111111",
        payerKey: new PublicKey("11111111111111111111111111111112"),
    }).compileToV0Message();
    const transaction = new VersionedTransaction(message);

    // Serialize and encode transaction
    return bs58.encode(transaction.serialize());
}

export const LAMPORT_COUNT = 1000000000;