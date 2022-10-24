import { MongoClient } from "mongodb";

export async function connectToDataBase() {
  const client = await MongoClient.connect(
    "mongodb+srv://Micke:liverpool123@cluster0.hurobob.mongodb.net/?retryWrites=true&w=majority"
  );

  return client;
}
