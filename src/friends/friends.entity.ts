
import {
    BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {MoralStatsEntity} from "../moral_stats/moralStats.entity";
import {UserEntity} from "../user/user.entity";
import {IsDefined} from "class-validator";
import {UserProfileEntity} from "../userProfile/userProfile.entity";

@Entity('friends')
export class FriendsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(type => UserEntity)
    @JoinColumn()
    friend: UserEntity;


    @ManyToOne(type => UserEntity, user => user.id)
    user: UserEntity;

}