// built in node.js crypto library
import { generateKeyPairSync } from "crypto";
// built in node.js file-system to handle files
import { writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function genKeyPair() {
    // generates an object where the keys are stored in properties `privateKey and `publicKey`
    const keyPair = generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem", // Most common formatting choice
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem", // Most common formatting choice
        },
    });
    // Create the public key file
    writeFileSync(`${__dirname}/id_rsa_pub.pem`, keyPair.publicKey);
    // Create the private key file
    writeFileSync(`${__dirname}/id_rsa_priv.pem`, keyPair.privateKey);
}
// calling function to generate the key pair
genKeyPair();
