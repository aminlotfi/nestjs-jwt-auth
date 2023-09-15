import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: String, unique: true }) // Use type String for _id
    _id: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    password: string;

    @Prop()
    refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);