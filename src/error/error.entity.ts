import {Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ErrorRO} from "./error.dto";

@Entity('error')
export class ErrorEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text',{
        default: ''
    })
    description:string;

    @CreateDateColumn()
    created: Date;

    toResponseObject(): ErrorRO {
        return {description:this.description,id:this.id,name:this.name};
    }
}