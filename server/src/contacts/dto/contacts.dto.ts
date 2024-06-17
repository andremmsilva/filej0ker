import { IsString } from 'class-validator';

export type ContactSQL = {
  id: number;
  firstId: number;
  secondId: number;
  createdAt: Date;
  contactStatus: "invited" | "friends" | "refused" | "blocked";
};

export class AddContactRequestDto {
  @IsString()
  email!: string;
}

export interface IRespondContactRequestParams {
  reqId: number;
}
