import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'generated/prisma'

@Exclude()
export class UserResponseDTO {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    roles: UserRole[];
}
