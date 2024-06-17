import { IsString } from 'class-validator';

export type ContactRequestSQL = {
  id: number;
  firstid: number;
  secondid: number;
  createdat: Date;
  contactstatus: "invited" | "friends" | "refused" | "blocked";
};

export class AddContactRequestDto {
  @IsString()
  email!: string;
}

export interface IRespondContactRequestParams {
  reqId: number;
}
