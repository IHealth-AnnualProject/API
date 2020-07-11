import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";
import {UserEntity} from "../user/user.entity";

@Entity('token_user_entity')
export class TokenUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    token: string;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column()
    date:number;
}