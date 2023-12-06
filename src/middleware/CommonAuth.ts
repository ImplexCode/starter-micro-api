import { Request, NextFunction, Response } from 'express'
import {AuthPayload } from '../dto'
import { ValidateSignature } from '../utility';
import { SessionData } from 'express-session';

declare global {
    namespace Express{
        interface Request{
            user?: AuthPayload
        }
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const signature = await ValidateSignature(req);
    if(signature){
        return next()
    }else{
        return res.json({message: "User Not authorized"});
    }
}

export const AdminAuthenticate = async (req: Request & {session: any}, res: Response, next: NextFunction) => {
    if(req.session.user){
      next();
    }
    else{
        res.status(401).json({message: "Unauthorized Request"})
    }
}