import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "./schemas/user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    async findOne(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async create(user: Partial<User>): Promise<User> {
        return this.userModel.create(user);
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }
}
