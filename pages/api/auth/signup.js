import { connectToDataBase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function handler(req, res) {
  console.log("METODA BRE!:", req.method);
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          "Invalid input -password should also ne at least 7 characters long.",
      });
      client.close();
      return;
    }

    const client = await connectToDataBase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      res.status(422).json({ message: "User exists already." });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);
    const result = await db
      .collection("users")
      .insertOne({ email, password: hashedPassword });

    res.status(201).json({ message: "Created user!" });
    client.close();
  }

  return;
}

export default handler;
