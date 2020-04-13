
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {UserRO} from "./user.dto";
import {BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column({
        type: 'varchar',
        unique: true,
    })
    username: string;

    @Column('text')
    password: string;


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    //add token?
    toResponseObject(showToken: boolean = true): UserRO {
        return {id:this.id,created:this.created,username:this.username};
    }
    }