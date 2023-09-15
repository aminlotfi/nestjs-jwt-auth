import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength} from "class-validator";

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @MaxLength(20, {message: 'Password must not exceed 20 characters'})
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {message: 'Password must contain at least one letter and one number',})
    password: string;
}