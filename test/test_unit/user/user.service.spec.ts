import {HttpException} from "@nestjs/common";
import {UserService} from "../../../src/user/user.service";
import {Repository} from "typeorm";
import {UserEntity} from "../../../dist/user/user.entity";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {UserDTO} from "../../../src/user/user.dto";
let mockedRepository: MockType<Repository<UserEntity>>;

import 'dotenv/config';

export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
    };


describe('UserService', ()=>{
    let userService:UserService;
    beforeEach(async () => {
        let module: TestingModule;
        module = await Test.createTestingModule({
            providers: [
                UserService,
                // Provide your mock instead of the actual repository
                {provide: getRepositoryToken(UserEntity), useFactory: repositoryMockFactory},
            ],
        }).compile();

        mockedRepository = module.get(getRepositoryToken(UserEntity));
        userService = module.get<UserService>(UserService);
    });
        describe('register', () => {
            it('should return false', async () => {
                const username: string = 'username';
                const userDto:UserDTO = new UserDTO();
                const userEntity:UserEntity= new UserEntity();
                userEntity.username =username;
                userEntity.id ="id";
                userEntity.password ='password';
                userDto.username = username;
                userDto.password = 'password';

                mockedRepository.findOne.mockReturnValue(false);
                mockedRepository.create.mockReturnValue(userEntity);
                await userService.register(userDto);
                expect(mockedRepository.findOne).toHaveBeenCalledWith({where:{username}});
            })
        });
});


//@ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
    create: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
}));