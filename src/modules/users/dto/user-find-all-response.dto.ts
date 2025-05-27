import { Exclude } from 'class-transformer';
import { UserRole } from 'generated/prisma'

@Exclude()
export class UserFindAllResponseDTO {
    users: {
        id: number
        name: string;
        email: string;
        roles: UserRole[];
    }[]

    total: number
    page: any;
    lastPage: number;
}
