
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
    username: string;

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
    email:string;

    @Column('date')
    birthdate: Date;

    @Column("geometry",{nullable :true})
    geolocation:string;

    @OneToOne(type => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column('text')
    description: string;

    toResponseObject(): PsychologistRO {
        return {first_name:this.first_name,last_name:this.last_name,birthdate:this.birthdate,description:this.description,id:this.id,email:this.email,username:this.username};
    }
}