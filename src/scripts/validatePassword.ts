import bcrypt from "bcryptjs";

export default async function validateUserPassword({ password, userPassword }: { password: string, userPassword: string }): Promise<boolean> {
  return await bcrypt.compare(password, userPassword);
}