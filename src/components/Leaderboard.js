import React from "react";
import { motion } from "framer-motion";

const Leaderboard = ({ scores }) => {
  return (
    <motion.div
      className="w-full max-w-md bg-white bg-opacity-10 rounded-lg shadow-lg p-6 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
        Leaderboard
      </h2>
      <div className="overflow-hidden rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white">
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Username</th>
              <th className="py-2 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <motion.tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white bg-opacity-5"
                    : "bg-white bg-opacity-10"
                }
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{score.username}</td>
                <td className="py-2 px-4 text-right">{score.score}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
