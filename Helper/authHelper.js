import bcrypt from "bcrypt";

/**
 * Hashes a plain text password securely using bcrypt.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 * @throws {Error} If an error occurs during hashing.
 */
export const hashPassword = async (password) => {
  try {
    // Generate a random salt for increased security.
    const saltRounds = 10; // Adjust this value based on security needs and processing time.
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt.
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Re-throw the error for proper handling.
  }
};

/**
 * Compares a plain text password with a hashed password using bcrypt.
 *
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 * @throws {Error} If an error occurs during comparison.
 */
export const comparePassword = async (password, hashedPassword) => {
  try {
    // Compare the password with the hashed password using bcrypt's secure comparison function.
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error; // Re-throw the error for proper handling.
  }
};
