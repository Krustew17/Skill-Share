import { HttpException } from '@nestjs/common';

export default function validatePassword(password: string) {
  if (password.length < 8) {
    throw new HttpException('Password must be at least 8 characters', 400);
  }
  if (!/[a-z]/.test(password)) {
    throw new HttpException(
      'Password must contain at least one lowercase letter',
      400,
    );
  }
  if (!/[0-9]/.test(password)) {
    throw new HttpException('Password must contain at least one number', 400);
  }

  return password;
}
