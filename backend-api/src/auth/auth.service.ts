import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        name: dto.name,
        subscription: { create: { plan: 'FREE', aiRequestsLimit: 50 } },
        browserSettings: { create: {} },
        workspaces: {
          create: [
            {
              name: 'Maqjeez',
              slug: 'maqjeez',
              color: '#FFE600',
              isDefault: true,
              startupUrls: [
                'https://www.mercadolibre.com.ar',
                'https://web.whatsapp.com',
                'https://mail.google.com',
                'https://www.madsjeez.com',
              ],
            },
            {
              name: 'Materia Natural',
              slug: 'materia-natural',
              color: '#10B981',
              startupUrls: [
                'https://www.instagram.com',
                'https://www.facebook.com',
                'https://web.whatsapp.com',
              ],
            },
          ],
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    return this.createTokens(user.id, user.email);
  }

  async login(dto: LoginDto, userAgent?: string, ip?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.createTokens(user.id, user.email, userAgent, ip);
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.session.delete({ where: { id: session.id } });
    return this.createTokens(session.userId, session.user.email);
  }

  async logout(refreshToken: string) {
    await this.prisma.session.deleteMany({ where: { refreshToken } });
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) return { success: true, message: 'If email exists, reset link sent' };

    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordReset.create({
      data: {
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    return { success: true, message: 'If email exists, reset link sent', token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const reset = await this.prisma.passwordReset.findUnique({
      where: { token: dto.token },
    });
    if (!reset || reset.used || reset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { email: reset.email },
        data: { passwordHash },
      }),
      this.prisma.passwordReset.update({
        where: { id: reset.id },
        data: { used: true },
      }),
    ]);

    return { success: true, message: 'Password updated' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        subscription: true,
        browserSettings: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async createTokens(
    userId: string,
    email: string,
    userAgent?: string,
    ip?: string,
  ) {
    const payload = { sub: userId, email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = randomBytes(48).toString('hex');
    const refreshDays = parseInt(
      this.config.get('JWT_REFRESH_EXPIRES_IN', '7d').replace('d', ''),
    );

    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        userAgent,
        ipAddress: ip,
        expiresAt: new Date(Date.now() + refreshDays * 86400000),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: { id: userId, email },
    };
  }
}
