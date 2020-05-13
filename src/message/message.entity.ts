import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {UserRO} from "../user/user.dto";
import {UserProfileRO} from "../userProfile/userProfile.dto";


@Entity('message')
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiPropertyOptional()
    @CreateDateColumn()
    created: Date;

    @Column('text')
    textMessage:string;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    from: UserEntity;

    @ManyToOne(type => UserEntity)
    @JoinColumn()
    to: UserEntity;

    toResponseObject(): MessageEntityRO {
        let to:any = this.to;
        if(to instanceof UserEntity ){
            to=to.toResponseObject();
        }

        let from:any = this.from;
        if(from instanceof UserEntity ){
            from=from.toResponseObject();
        }
        return {id:this.id,from:from,to:to,textMessage:this.textMessage,created:this.created};
    }
}

export class MessageEntityRO{
    @ApiProperty()
    id: string;
    @ApiProperty()
    created: Date;
    @ApiProperty()
    textMessage:string;
    @ApiProperty()
    from: UserRO;
    @ApiProperty()
    to: UserRO;
}

