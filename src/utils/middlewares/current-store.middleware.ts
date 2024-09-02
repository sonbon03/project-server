import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { StoreEntity } from 'src/users/entities/store.entity';
import { UsersService } from 'src/users/users.service';

declare global {
  namespace Express {
    interface Request {
      currentStore?: StoreEntity;
    }
  }
}

@Injectable()
export class CurrentStoreMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith(`${process.env.ACCESS_TOKEN_TYPE} `)
    ) {
      req.currentStore = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        const { id } = <JwtPayload>(
          verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        );
        const currentStore = await this.usersService.findOneStore(id);
        req.currentStore = currentStore;
        next();
      } catch (error) {
        req.currentStore = null;
        next();
      }
    }
  }
}

interface JwtPayload {
  id: string;
}
