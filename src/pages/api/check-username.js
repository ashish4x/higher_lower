import dbConnect from "../../lib/mongodb";
import Leaderboard from "../../models/Leaderboard";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { username } = req.body;
    try {
      const existingUser = await Leaderboard.findOne({ username });
      if (existingUser) {
        res.status(409).json({ message: "Username already taken" });
      } else {
        res.status(200).json({ message: "Username available" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error checking username", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
