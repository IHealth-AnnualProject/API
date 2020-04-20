import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserProfileEntity} from "../userProfile/userProfile.entity";


@Entity('moral_stats')
export class MoralStatsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column('int')
    value: number;

    @ManyToOne(type => UserProfileEntity, userProfile => userProfile.id)
    userProfile: UserProfileEntity;

}