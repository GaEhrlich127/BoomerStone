import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
    const { db } = await connectToDatabase();

    const cards = await db
        .collection("Year 1 & 2")
        .find({ Keywords : "Taunt" })
        .sort({})
        .limit(10)
        .toArray();

    res.json(cards);
};