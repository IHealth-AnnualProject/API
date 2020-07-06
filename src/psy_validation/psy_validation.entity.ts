import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PsyValidationRO } from './psy_validation.dto';

@Entity('psy_validation')
export class PsyValidationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    username: string;

    @Column('text')
    password: string;

    @Column('text')
    email: string;

    @CreateDateColumn()
    created: Date;

    toResponseObject(): PsyValidationRO {
        return {username:this.username,id:this.id,email:this.email,created :this.created};
    }
}