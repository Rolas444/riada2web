
export type MembershipState = "A" | "I" ;

export interface Membership {
  id?: string;
  personId: string;
  startedAt?: string; //YYYY-MM-DD
  state: MembershipState;
  membershipSigned: boolean;
  transferred: boolean;
  nameLastChurch?: string;
  baptized?: boolean;
  baptismDate?: string; //YYYY-MM-DD
}