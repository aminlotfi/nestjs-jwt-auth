import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {UserSchema} from "./schemas/user.schema";

@Module({
    providers: [UserService],
    controllers: [UserController],
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
    exports: [UserService],
})
export class UserModule {
}
