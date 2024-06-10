export interface RegisterUserDTO  {
  email?: string;
  user_name?: string;
  full_name?: string;
  password?: string;
  created_at?: Date;
  user_role?: string;
  active?: boolean;
}