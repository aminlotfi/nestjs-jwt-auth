import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "./schemas/user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {
    }

    // The findOneById() method is used to find a user by id.
    async findOneById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    // The findOneByEmail() method is used to find a user by email.
    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({email}).exec();
    }

    // The create() method is used to create a new user.
    async create(user: Partial<User>): Promise<User> {
        return this.userModel.create(user);
    }

    // The update() method is used to update a user.
    async update(id: string, user: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, user, {new: true}).exec();
    }
}
