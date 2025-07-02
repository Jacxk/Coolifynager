export type TeamMember = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  two_factor_confirmed_at: string;
  force_password_reset: boolean;
  marketing_emails: boolean;
};

export type Team = {
  id: number;
  name: string;
  description: string;
  personal_team: boolean;
  created_at: string;
  updated_at: string;
  show_boarding: boolean;
  custom_server_limit: string;
  members: TeamMember[];
};
