
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {
    BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserEntity} from "../user/user.entity";

export enum FriendRequestState {
    PENDING = "PENDING",
    ACCEPT = "ACCEPT",
    DENIED = "DENIED"
}

@Entity('friend_request')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    from: UserEntity;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    to: UserEntity;

    @Column({
        type: "enum",
        enum: FriendRequestState,
        default: FriendRequestState.PENDING
    })
    state:FriendRequestState;

}

