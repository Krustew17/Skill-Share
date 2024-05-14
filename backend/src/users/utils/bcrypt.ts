import * as bcrypt from 'bcrypt';

export function hashPassword(rawPassword: string): Promise<string> {
  const saltRounds = bcrypt.genSaltSync();
  return bcrypt.hash(rawPassword, saltRounds);
}

export function comparePasswords(rawPassword: string, hash: string) {
  return bcrypt.compareSync(rawPassword, hash);
}
