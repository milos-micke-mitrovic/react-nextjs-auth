import { getSession } from "next-auth/client";

import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDataBase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated." });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDataBase();
  const usersCollection = client.db().collection("users");
  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found." });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password." });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  console.log({ hashedPassword, userEmail });

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  res.status(200).json({ message: "Successfuly changed password." });
  client.close();
}

export default handler;
