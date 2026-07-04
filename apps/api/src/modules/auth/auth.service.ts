import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterInput, LoginInput, ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from '@renewly/validation';
import { User } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterInput) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const passwordHash = await argon2.hash(data.password);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      passwordHash,
      emailVerificationToken,
    });

    // TODO: Send verification email

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: this.excludeHash(user),
      ...tokens,
    };
  }

  async login(data: LoginInput) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, data.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: this.excludeHash(user),
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { refreshTokenHash: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.passwordHash) {
      throw new BadRequestException('User not found');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, data.currentPassword);
    if (!passwordMatches) {
      throw new BadRequestException('Invalid current password');
    }

    const newPasswordHash = await argon2.hash(data.newPassword);
    await this.usersService.update(userId, {
      passwordHash: newPasswordHash,
      refreshTokenHash: null, // logout from other devices
    });
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      return; // Do not leak user existence
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.usersService.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    // TODO: Send reset email
  }

  async resetPassword(data: ResetPasswordInput) {
    const user = await this.usersService.findByResetToken(data.token);
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const newPasswordHash = await argon2.hash(data.newPassword);
    await this.usersService.update(user.id, {
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshTokenHash: null, // logout from all devices
    });
  }

  async verifyEmail(data: VerifyEmailInput) {
    const user = await this.usersService.findByVerificationToken(data.token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.usersService.update(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
    });
  }

  private async getTokens(userId: string, email: string, role: string) {
    const jwtPayload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'fallback_access_secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'fallback_refresh_secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await argon2.hash(refreshToken);
    await this.usersService.update(userId, { refreshTokenHash: hash });
  }

  excludeHash(user: User): Partial<User> {
    const { passwordHash: _ph, refreshTokenHash: _rh, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  }
}
