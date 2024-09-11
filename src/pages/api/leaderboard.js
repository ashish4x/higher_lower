import dbConnect from '../../lib/mongodb';
import Leaderboard from '../../models/Leaderboard';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const leaderboard = await Leaderboard.find().sort({ score: -1 }).limit(15);
      res.status(200).json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching leaderboard', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}