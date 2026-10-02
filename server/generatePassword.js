import bcrypt from "bcrypt";

const password = "123kush@uu";
const hash = await bcrypt.hash(password, 10);

console.log(hash);