import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({type: String, unique: true})
    _id: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    password: string;

    @Prop()
    hashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);