

export class PsychologistDTO {

    first_name: string;

    last_name: string;
    email:string;
    username:string;

    birthdate: string;

    geolocation:string;

    user;
}

export class PsychologistDTOID {
    id :string;
    first_name: string;

    last_name: string;

    email:string;
    username:string;

    birthdate: Date;

    geolocation:string;

    user;
}

export class PsychologistRO{
    id:string;

    email:string;
    username:string;
    first_name: string;

    last_name: string;

    birthdate: Date;

    description:string;
}