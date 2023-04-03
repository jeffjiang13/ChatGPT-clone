// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { adminDb } from "@/firebase/firebaseAdmin";
import query from "@/utils/queryApi";
import admin from "firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "Please Provide a prompt" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat Id" });
    return;
  }

  // ChatGpt Query

  const response = await query(prompt, chatId, model);

  const message: Message = {
    text: response || "ChatGpt unable to answer that!",
    createdAt: admin.firestore.Timestamp.now(),
    user: {
      _id: "ChatGPT",
      name: "ChatGPT",
      email: "ChatGPT",
      avatar:
        "data:image/png;base64,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",
    },
  };

  await adminDb
    .collection("users")
    .doc(session?.user?.uid)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add(message);

  res.status(200).json({ answer: message.text });
}
