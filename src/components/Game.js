"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInterval } from "react-use";
import UsernameInput from "./UsernameInput";
import Leaderboard from "./Leaderboard";

const Sparkle = ({ style }) => (
  <motion.div
    initial={{ scale: 0, rotate: 0 }}
    animate={{
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      opacity: [1, 1, 0],
    }}
    transition={{ duration: 0.5 }}
    style={{
      position: "absolute",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "white",
      ...style,
    }}
  />
);

const Game = () => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [highestScore, setHighestScore] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const playSound = useCallback((frequency, duration, type = "sine") => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + duration
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, []);

  const playCorrectSound = useCallback(() => {
    playSound(523.25, 0.1); // C5
    setTimeout(() => playSound(659.25, 0.1), 100); // E5
  }, [playSound]);

  const playGameOverSound = useCallback(() => {
    playSound(392.0, 0.1); // G4
    setTimeout(() => playSound(349.23, 0.2), 100); // F4
  }, [playSound]);

  const playHighScoreSound = useCallback(() => {
    playSound(523.25, 0.1); // C5
    setTimeout(() => playSound(659.25, 0.1), 100); // E5
    setTimeout(() => playSound(783.99, 0.2), 200); // G5
  }, [playSound]);

  useEffect(() => {
    if (username) {
      generateNewNumber();
      fetchLeaderboard();
    }
  }, [username]);

  useEffect(() => {
    if (leaderboard.length > 0) {
      setHighestScore(leaderboard[0].score);
    }
  }, [leaderboard]);

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
    setShowDescription(false);

    if (
      (guess === "higher" && nextNumber > currentNumber) ||
      (guess === "lower" && nextNumber < currentNumber)
    ) {
      playCorrectSound();
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        if (newScore > highestScore) {
          setShowSparkles(true);
          generateSparkles();
          playHighScoreSound();
        }
        return newScore;
      });
      setCurrentNumber(nextNumber);
    } else {
      playGameOverSound();
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
    setShowDescription(true);
    setShowSparkles(false);
  };

  const handleUsernameSubmit = (newUsername) => {
    setUsername(newUsername);
    generateNewNumber();
    fetchLeaderboard();
  };

  const generateSparkles = () => {
    const newSparkles = Array.from({ length: 50 }, () => ({
      id: Math.random(),
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      },
    }));
    setSparkles(newSparkles);
  };

  useInterval(() => {
    if (showSparkles) {
      generateSparkles();
    }
  }, 500);

  if (!username) {
    return <UsernameInput onUsernameSubmit={handleUsernameSubmit} />;
  }

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white pt-10 px-4 overflow-hidden">
      <AnimatePresence>
        {showSparkles &&
          sparkles.map((sparkle) => (
            <Sparkle key={sparkle.id} style={sparkle.style} />
          ))}
      </AnimatePresence>

      <motion.h1
        className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        Higher or Lower
      </motion.h1>

      <motion.div
        className="text-2xl mb-6 font-semibold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
      >
        Welcome, {username}!
      </motion.div>

      <AnimatePresence>
        {showDescription && (
          <motion.div
            className="text-center mb-8 max-w-md bg-white bg-opacity-10 p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2">
              Guess if the next number will be higher or lower than the current
              number.
            </p>
            <p>The game continues until you guess incorrectly. Good luck!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!gameOver ? (
        <div className="flex flex-col items-center">
          <motion.div
            className="text-8xl font-bold mb-8"
            key={currentNumber}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {currentNumber}
          </motion.div>
          <div className="flex space-x-6 mb-8">
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleGuess("higher")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Higher
            </motion.button>
            <motion.button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={() => handleGuess("lower")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Lower
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          className="text-3xl mb-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4">Game Over! Your score: {score}</p>
          <motion.button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={restartGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Play Again
          </motion.button>
        </motion.div>
      )}

      <motion.div
        className="text-3xl mb-8 font-semibold"
        animate={{ scale: score > highestScore ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        Score: {score}
      </motion.div>

      <Leaderboard scores={leaderboard} />
    </div>
  );
};

export default Game;
