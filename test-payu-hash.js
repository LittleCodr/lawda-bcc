const crypto = require("crypto");
const key = "VyDRHz";
const txnid = "ORD-123";
const amount = "100.00";
const productinfo = "Octopus Perfume Order";
const firstname = "John Doe";
const email = "john@example.com";
const udf1 = "user_123";
const salt = "2OVe4Lp82WqQC8vfEBtHDESIwY9p1HK1";

const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}||||||||||${salt}`;
const hash = crypto.createHash("sha512").update(hashString).digest("hex");

console.log("Hash String:", hashString);
console.log("Hash:", hash);
