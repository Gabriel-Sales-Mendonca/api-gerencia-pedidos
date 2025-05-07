import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LocationResponseDTO {
    @Expose()
    id: number;

    @Expose()
    name: string;
}
