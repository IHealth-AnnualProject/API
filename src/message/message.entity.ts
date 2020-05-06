import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";


@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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