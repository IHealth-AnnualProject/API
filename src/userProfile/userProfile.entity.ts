
import {
    BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import {MoralStatsEntity} from "../moral_stats/moralStats.entity";
import {UserEntity} from "../user/user.entity";
import {IsDefined} from "class-validator";
import {UserProfileRO} from "./userProfile.dto";
import {FriendsEntity} from "../friends/friends.entity";

@Entity('user_profile')
export class UserProfileEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('text',{
        default: ''
    })
    email: string;

    @OneToMany(type => MoralStatsEntity, moral => moral.userProfile)
    moral: MoralStatsEntity[];

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column('text',{
        default: ''
    })
    geolocation:string;

    @Column('text',{
        default: ''
    })
    description: string;

    @Column('date')
    birthdate:Date;

    toResponseObject(): UserProfileRO {
        let user:any = this.user;
        if(user instanceof UserEntity ){
            user=user.toResponseObject();
        }
        return {id:this.id,email:this.email,description:this.description,user:user,birthdate:this.birthdate};
    }
}