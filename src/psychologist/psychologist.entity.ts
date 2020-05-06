
import {
    BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm";
import {PsychologistRO} from "./psychologist.dto";
import {UserEntity} from "../user/user.entity";

@Entity('psychologist')
export class PsychologistEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column('text',{
        default: ''
    })
    first_name: string;

    @Column('text',{
        default: ''
    })
    last_name: string;

    @Column('text',{
        default: ''
    })
    email;

    @Column('text')
    age: number;

    @Column("geometry",{nullable :true})
    geolocation:string;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column('text')
    description: string;

    toResponseObject(): PsychologistRO {
        return {first_name:this.first_name,last_name:this.last_name,age:this.age,description:this.description,id:this.id};
    }
}