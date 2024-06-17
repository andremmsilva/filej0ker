import { IsString } from 'class-validator';

export type ContactRequestSQL = {
  id: number;
  firstid: number;
  secondid: number;
  createdat: Date;
  contactstatus: "invited" | "friends" | "refused" | "blocked";
};

export type ContactResponseDto = {
  id: number;
  createdat: Date;
  contactstatus: "invited" | "friends" | "refused" | "blocked";
  sender_id: number;
  sender_full_name: string;
  sender_email: string;
  sender_user_name: string;
  sender_user_role: string;
  target_id: number;
  target_full_name: string;
  target_email: string;
  target_user_name: string;
  target_user_role: string;
}

export class AddContactRequestDto {
  @IsString()
  email!: string;
}

export interface IRespondContactRequestParams {
  reqId: number;
}
