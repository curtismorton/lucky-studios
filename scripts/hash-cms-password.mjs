#!/usr/bin/env node

import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2]?.trim();

if (!password) {
  console.error("Usage: npm run cms:hash-password -- '<password>'");
  process.exit(1);
}

const iterations = 210000;
const salt = randomBytes(16);
const digest = pbkdf2Sync(password, salt, iterations, 32, "sha256");

const hash = [
  "pbkdf2_sha256",
  String(iterations),
  salt.toString("hex"),
  digest.toString("hex"),
].join("$");

console.log(hash);
