import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.verifyPassword(user, password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayloadDto = {
      sub: user.id,
      username: user.email,
      isAdmin: user.isAdmin,
    };
    const extras =
      !user.isAdmin && !user.matricOrStaffNumber ? { firstTime: true } : {};

    return {
      token: this.jwtService.sign(payload),
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricOrStaffNumber: user.matricOrStaffNumber,
        department: user.department,
      },
      ...extras,
    };
  }
}
