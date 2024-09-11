"use client";
import React, { useState, useEffect } from "react";
import UsernameInput from "./UsernameInput";
import Leaderboard from "./Leaderboard";

const Game = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (username) {
      generateNewNumber();
      fetchLeaderboard();
    }
  }, [username]);

  const generateNewNumber = () => {
    setCurrentNumber(Math.floor(Math.random() * 100) + 1);
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleGuess = (guess) => {
    const nextNumber = Math.floor(Math.random() * 100) + 1;

    if (
      (guess === "higher" && nextNumber > currentNumber) ||
      (guess === "lower" && nextNumber < currentNumber)
    ) {
      setScore(score + 1);
      setCurrentNumber(nextNumber);
    } else {
      setGameOver(true);
      updateLeaderboard();
    }
  };

  const updateLeaderboard = async () => {
    try {
      await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score }),
      });
      fetchLeaderboard();
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    generateNewNumber();
  };

  const handleUsernameSubmit = (newUsername) => {
    setUsername(newUsername);
    generateNewNumber();
    fetchLeaderboard();
  };

  if (!username) {
    return <UsernameInput onUsernameSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-800 text-white pt-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Higher or Lower</h1>
      <div className="text-xl mb-4">Welcome, {username}!</div>
      {!gameOver ? (
        <>
          <div className="text-6xl font-bold mb-8">{currentNumber}</div>
          <div className="flex space-x-4 mb-8">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleGuess("higher")}
            >
              Higher
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleGuess("lower")}
            >
              Lower
            </button>
          </div>
        </>
      ) : (
        <div className="text-2xl mb-8">
          Game Over! Your score: {score}
          <button
            className="ml-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      )}
      <div className="text-2xl mb-8">Score: {score}</div>
      <Leaderboard scores={leaderboard} />
    </div>
  );
};

export default Game;
