import dbConnect from "../../lib/mongodb";
import Leaderboard from "../../models/Leaderboard";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { username, score } = req.body;
    try {
      const existingEntry = await Leaderboard.findOne({ username });

      if (existingEntry) {
        // If the user exists, update the score only if the new score is higher
        if (score > existingEntry.score) {
          existingEntry.score = score;
          await existingEntry.save();
        }
        res.status(200).json(existingEntry);
      } else {
        // If the user doesn't exist, create a new entry
        const newEntry = new Leaderboard({ username, score });
        await newEntry.save();
        res.status(201).json(newEntry);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating score", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
