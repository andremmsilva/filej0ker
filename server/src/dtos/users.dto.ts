import { IsString } from "class-validator";

export class SearchRequestDTO {
  @IsString()
  query!: string;
}
