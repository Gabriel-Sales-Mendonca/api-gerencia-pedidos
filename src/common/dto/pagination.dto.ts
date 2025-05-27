import { Type } from "class-transformer"
import { IsInt, IsOptional } from "class-validator"

export class PaginationDTO {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    page?: number = 1
    
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    limit?: number = 10
}