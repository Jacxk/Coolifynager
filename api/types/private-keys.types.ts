export type PrivateKey = {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  fingerprint: string;
  is_git_related: boolean;
  private_key: string;
  public_key: string;
  team_id: number;
  created_at: string;
  updated_at: string;
};
