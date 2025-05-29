import { Exclude } from 'class-transformer';

@Exclude()
export class LocationFindAllResponseDTO {
    locations: {
        id: number;
        name: string;
    }[]

    total: number;
    page: number;
    lastPage: number;
}
