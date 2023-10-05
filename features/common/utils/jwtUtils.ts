import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { PasswordType } from "../../featureUser/domain/model/PasswordType";
import { logger } from "../../../common/winstonLoggerConfiguration";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathToPrivKey = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "id_rsa_priv.pem"
);
const pathToPubKey = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "id_rsa_pub.pem"
);
// const pathToPrivKey = path.join(__dirname, "/etc/secrets/id_rsa_priv.pem");
// const pathToPubKey = path.join(
//   __dirname,
//   "..",
//   "..",
//   "..",
//   "/etc/secretsid_rsa_pub.pem"
// );
const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf-8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf-8");

export type passwordType = {
  salt: string;
  hash: string;
};

/**
 * @param {*} password - the plain text password
 * @param {*} passwordHashsed - Object of `passwordType` which have salt and hash as string.
 * @returns true if hash provided is correct

This function uses crypto library to decrypt the hash using the salt and then
compares the decrypted hash/salt with the password that the user provided at login
 */
export function validPassword(
  password: string,
  passwordHashsed: PasswordType
): boolean {
  const { hash, salt } = passwordHashsed;

  // PBKDF2 is a simple cryptographic key derivation function, which is resistant to dictionary attacks and rainbow table attacks
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return hash === hashVerify;
}

/**
 *
 * @param {*} password - the password string that the suere inputs to the password field in the register form
 *
 * This function takes a plain text passsword and creates a salt and hash out of it.
 * Instead of storing the plaintext password in the databse, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password
 * You would then store the hasshed password in the database and then re-hash it to veryfy later (similar to what we do here)
 * @returns js object with generated salt and hash
 */
export function genPassword(password: string): PasswordType {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt,
    hash: genHash,
  };
}

export type jwtType = {
  token: string;
  expiresIn: string;
};

/**
 *
 * @param {*} username - The username of user. We need this to set the JWT `sub` payload property to the MongoDB user ID
 * @returns js object with token and expires in fields
 */
export function issueJWT(username: string): jwtType {
  const expiresIn = "1y";

  const payload = {
    sub: username,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: "RS256",
  });

  return {
    token: `Bearer ${signedToken}`,
    expiresIn,
  };
}

/**
 * Splits the token into parts based on space delimiter.
 * @param token - The token string.
 * @returns An array of token parts.
 */
export const getTokenParts = (token: string): string[] => {
  return token.split(" ");
};

/**
 * Checks if the token matches the expected pattern.
 * @param token - The token string.
 * @returns A boolean indicating if the token is valid.
 */
const isTokenValid = (token: string): boolean => {
  return token.match(/\S+\.\S+\.\S+/) !== null;
};

/**
 * Retrieves the username from the provided token.
 * @param token - The token string.
 * @returns The username extracted from the token.
 */
export const getUsernameFromToken = (token: string): string => {
  const verification = jsonwebtoken.verify(token, PUB_KEY, {
    algorithms: ["RS256"],
  }) as { sub?: string };

  return verification.sub?.toString() || "";
};

/**
 * Express middleware for authentication.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next function to call in the middleware chain.
 */
export const authMiddleware: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const tokenPartsString = req.headers.authorization;

    if (!tokenPartsString) {
      throw createHttpError(401, "You are not authorized to visit this route.");
    }

    const tokenParts = getTokenParts(tokenPartsString);

    if (tokenParts[0] === "Bearer" && isTokenValid(tokenParts[1])) {
      try {
        // const publicKey = PUB_KEY; // Replace with your public key
        const username = getUsernameFromToken(tokenParts[1]);

        req.jwt = tokenParts[1];
        req.token = tokenPartsString;
        req.body.username = username;

        next();
      } catch (error) {
        next(
          createHttpError(401, "You are not authorized to visit this route.")
        );
      }
    } else {
      next(createHttpError(401, "You are not authorized to visit this route."));
    }
  } catch (error) {
    next(error);
  }
};

// export { authenticateUser, getUsernameFromToken };

// export const authMiddleware: RequestHandler = async (req, res, next) => {
//   try {
//     const tokenPartsString = req.headers.authorization;

//     // console.log(`token is ${tokenPartsString}`);
//     if (!tokenPartsString) {
//       throw createHttpError(401, "you are not authorized to visit this route.");
//     }
//     const tokenParts = tokenPartsString.split(" ");
//     // console.log(tokenParts)

//     // logger.info(`string is ${tokenPartsString}`);
//     if (
//       tokenParts[0] === "Bearer" &&
//       tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
//     ) {
//       //   logger.info(tokenParts);
//       try {
//         const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
//           algorithms: ["RS256"],
//         });

//         const username = verification["sub"]?.toString() || "";
//         // logger.info(`verification is ${verification}`);

//         req.jwt = verification;
//         req.token = tokenPartsString;
//         req.body.username = username;

//         next();
//       } catch (error) {
//         // console.log(`error occured, ${error}`);
//         // return res.status(401).json({ success: false, msg: "you are not authorized to visit this route" });
//         next(
//           createHttpError(401, "you are not authorized to visit this route")
//         );
//       }
//     } else {
//       //   logger.info("inside else part");
//       // return res.status(401).json({ success: false, msg: "you are not authorized to visit this route" });
//       next(createHttpError(401, "you are not authorized to visit this route"));
//     }
//   } catch (error) {
//     next(error);
//   }
// };
