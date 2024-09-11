import React, { useState } from "react";
import { motion } from "framer-motion";

const UsernameInput = ({ onUsernameSubmit }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/check-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.status === 200) {
        onUsernameSubmit(username);
      } else if (response.status === 409) {
        setError("Username already taken. Please choose another.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.h1
          className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          Higher or Lower
        </motion.h1>
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-10 rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Choose your username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 bg-white bg-opacity-20 rounded-full text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-30 transition duration-300"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Checking...
              </motion.span>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Start Game
              </motion.span>
            )}
          </motion.button>
          {error && (
            <motion.p
              className="mt-4 text-red-400 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </motion.form>
      </motion.div>
    </div>
  );
};

export default UsernameInput;
