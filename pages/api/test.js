import { connectToDatabase } from "../../util/mongodb";

export default async (req, res) => {
    const { db } = await connectToDatabase();

    const cards = await db
        .collection("Year 1 & 2")
        .find({ Keywords : "Taunt" , _id:require('mongodb').ObjectID("60ce2211bbc32b1d34fb8d6e")})
        .sort({})
        .toArray();

    res.json(cards);
};