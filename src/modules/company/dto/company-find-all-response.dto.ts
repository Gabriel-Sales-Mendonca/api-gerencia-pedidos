import { Exclude } from 'class-transformer';

@Exclude()
export class CompanyFindAllResponseDTO {
    companies: {
        id: number;
        name: string;
    }[]

    total: number;
    page: number;
    lastPage: number;
}
