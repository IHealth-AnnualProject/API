import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ReportRO} from "./report.dto";
import {UserEntity} from "../user/user.entity";

@Entity('report')
export class ReportEntity {
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

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    from:UserEntity;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    to:UserEntity;


    @Column('boolean',{
        default: false
    })
    isResolve: boolean;

    toResponseObject(): ReportRO {
        return {created:this.created,description:this.description,id:this.id,name:this.name,from:this.from.toResponseObject(),to:this.to.toResponseObject(),isResolved:this.isResolve};
    }
}