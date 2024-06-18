import { IsNumberString, IsString, Matches } from 'class-validator';

export type ContactStatus = 'invited' | 'friends' | 'refused' | 'blocked';

export type ContactRequestSQL = {
  id: number;
  firstid: number;
  secondid: number;
  createdat: Date;
  contactstatus: ContactStatus;
};

export type ContactResponseDto = {
  id: number;
  createdat: Date;
  contactstatus: ContactStatus;
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
};

export class AddContactRequestDto {
  @IsString()
  email!: string;
}

export class RespondToContactRequestParams {
  @IsNumberString()
  reqId!: string;
}

export type RespondToContactAction = 'accept' | 'refuse' | 'block';

export class RespondToContactRequestDto {
  @IsString()
  @Matches(/^(accept|refuse|block)$/)
  action!: RespondToContactAction;
}
