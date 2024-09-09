import bcrypt from 'bcrypt';

/**
 * Hash a plain text password
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password
 */

const hashPass = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  } catch (error: any) {
    throw new Error("Error hashing password");
  }
}

export default hashPass;
