import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.SECRET || "superSecretKey";

const jwtOptions = {
  expiresIn: '1h',
};

export {
  jwtSecret,
  jwtOptions,
}
