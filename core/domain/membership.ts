
export type MembershipStatus = "A" | "I" | "O" |"S";

export interface Membership {
  id?: string;
  personId: string;
  startedAt?: string; //YYYY-MM-DD
  state: MembershipStatus;
  membershipSigned: boolean;
  status: string;
  transferred: boolean;
  nameLastChurch?: string;
  Baptized?: boolean;
  baptismDate?: string; //YYYY-MM-DD
}