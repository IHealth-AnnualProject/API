import {Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {ErrorRO, ErrorState} from "./error.dto";
import {FriendRequestState} from "../friendRequest/friendRequest.entity";

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

    @Column({
        type: "enum",
        enum: ErrorState,
        default: ErrorState.PENDING
    })
    state:ErrorState;

    toResponseObject(): ErrorRO {
        return {description:this.description,id:this.id,name:this.name,state:this.state,created:this.created};
    }

}