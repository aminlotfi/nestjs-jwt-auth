import {Module} from '@nestjs/common';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {MongooseModule} from "@nestjs/mongoose";
import {AtGuard} from "./common/guards";

@Module({
    imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest'), UserModule, AuthModule],
    controllers: [],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: AtGuard
        }
    ],
})
export class AppModule {
}
