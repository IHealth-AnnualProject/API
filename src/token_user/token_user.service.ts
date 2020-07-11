import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {TokenUserEntity} from "./token_user.entity";
import {Repository} from "typeorm";
import {QuestCreation} from "../quest/quest.validation";
import {TokenUserDTO} from "./token_user.dto";



@Injectable()
export class TokenUserService {

    constructor(
        @InjectRepository(TokenUserEntity)
        private tokenUserService: Repository<TokenUserEntity>,
    ) {}


    async create(userId:string){
        let randomToken = Array(32)
            .fill(null)
            .map(() => (Math.round(Math.random() * 16)).toString(16))
            .join('');
        let minutes = 30;
        let date:number = new Date(Date.now()+minutes*60000).getTime();
        let tokenUser:TokenUserDTO = {user:userId,date:date,token:randomToken};
        let tokenEntity = await this.tokenUserService.create(tokenUser);
        await this.tokenUserService.save(tokenEntity);
        return tokenEntity;
    }

    async isTokenValid(userToken:string){
        let token:TokenUserEntity = await this.tokenUserService.findOne({where:{token:userToken} ,relations:["user"]});
        if(!token || Date.now()>token.date){
            return false;
        }
        return token;
    }


}
