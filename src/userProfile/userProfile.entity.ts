
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

    //email retirer first_name last_name
    @Column('text')
    first_name: string;

    @Column('text')
    last_name: string;

    @Column('text')
    age: number;

    @OneToMany(type => MoralStatsEntity, moral => moral.userProfile)
    moral: MoralStatsEntity[];


    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column("geometry",{nullable :true})
    geolocation:string;

    @Column('text')
    description: string;

    toResponseObject(): UserProfileRO {
        let user:any = this.user;
        if(user instanceof UserEntity ){
            user=user.toResponseObject();
        }
        return {id:this.id,first_name:this.first_name,last_name:this.last_name,age:this.age,description:this.description,user:user};
    }
}