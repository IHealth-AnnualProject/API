import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {ApiPropertyOptional} from "@nestjs/swagger";


@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional()
    @CreateDateColumn()
    created: Date;

    @Column('text')
    textMessage:string;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    from: UserEntity;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    to: UserEntity;
}

export class MessageEntityRO{
    @ApiPropertyOptional()
    id: string;

    @ApiPropertyOptional()
    created: Date;
    @ApiPropertyOptional()
    textMessage:string;
    @ApiPropertyOptional()
    from: string;
    @ApiPropertyOptional()
    to: string;
}