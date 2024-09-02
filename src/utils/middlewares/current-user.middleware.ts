import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AdminEntity } from 'src/users/entities/admin.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Roles } from '../enums/user-roles.enum';
import { StoreEntity } from 'src/users/entities/store.entity';

export interface TypeCurrent {
  idAdmin: string;
  idUser: string;
  idStore: StoreEntity;
  roles: Roles;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: TypeCurrent;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith(`${process.env.ACCESS_TOKEN_TYPE} `)
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = <JwtPayload>(
          verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        );
        const currentAdmin = await this.usersService.findOneAdmin(id);
        req.currentUser = currentAdmin;
        next();
      } catch (error) {
        req.currentUser = null;
        next();
      }
    }
  }
}

interface JwtPayload {
  id: string;
}
