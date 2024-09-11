import React from "react";

const Leaderboard = ({ scores }) => {
  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <div className="bg-gray-700 rounded-lg shadow-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left pb-2">Rank</th>
              <th className="text-left pb-2">Username</th>
              <th className="text-right pb-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr
                key={index}
                className="border-b border-gray-600 last:border-b-0"
              >
                <td className="py-2">{index + 1}</td>
                <td className="py-2">{score.username}</td>
                <td className="py-2 text-right">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
