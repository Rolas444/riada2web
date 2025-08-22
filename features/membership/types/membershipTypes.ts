import { Membership, MembershipStatus } from "@/core/domain/membership";

export interface CreateMembershipRequest {
  personId: string;
  startedAt?: string; // YYYY-MM-DD
  state: MembershipStatus;
  membershipSigned: boolean;
  status: string;
  transferred: boolean;
  nameLastChurch?: string;
  Baptized?: boolean;
  baptismDate?: string; // YYYY-MM-DD
}

export interface UpdateMembershipRequest extends Partial<CreateMembershipRequest> {
  id: string;
}

// Para relación 1:1, una persona solo puede tener un membership
export interface MembershipResponse {
  success: boolean;
  data: Membership;
  message?: string;
}

// Para obtener todos los memberships del sistema
export interface MembershipsResponse {
  success: boolean;
  data: Membership[];
  message?: string;
}

// Para obtener el membership de una persona específica (1:1)
export interface PersonMembershipResponse {
  success: boolean;
  data: Membership | null; // null si la persona no tiene membership
  message?: string;
}
