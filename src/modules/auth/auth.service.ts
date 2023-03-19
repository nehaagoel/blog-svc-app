import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from '../../constants/constant';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, 
  ) {}

  generateToken(payload) {
    const options = {
      secret: jwtConstants.secret,
    };
    return `Bearer ${this.jwtService.sign(payload, options)}`;
  }
  async loginUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new NotAcceptableException('could not match password for user');
    }
    if (user && passwordValid) {
      const payload = {
        username: user.userName,
        email: user.email,
      };
      const options = {
        secret: jwtConstants.secret,
      };
      return {
        user: user,
        token: `Bearer ${this.jwtService.sign(payload, options)}`,
        blogPost: [],
      };
    }
    return null;
  }
}