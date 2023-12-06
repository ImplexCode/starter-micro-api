import { IsEmail, Length } from "class-validator";

export class AdminLoginInput {
  @IsEmail()
  email: string;
  
  @Length(6,12)
  password: string;
}

export class AdminRegisterInput {
  @IsEmail()
  email: string;
  
  @Length(6,12)
  password: string;

  @Length(3,16)
  firstName: string;

  @Length(3,16)
  admin:any
}