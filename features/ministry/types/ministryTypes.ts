import { Ministry, MinistryMember, MinistryStatus } from "@/core/domain/ministry";

// ===== MINISTRY TYPES =====
export interface CreateMinistryRequest {
  id?: string;
  name: string;
  description?: string;
  mission?: string;
  status: MinistryStatus;
}

export interface UpdateMinistryRequest extends Partial<CreateMinistryRequest> {
  id: string;
}

export interface MinistryResponse {
  success: boolean;
  data: Ministry;
  message?: string;
}

export interface MinistriesResponse {
  success: boolean;
  data: Ministry[];
  message?: string;
}

// ===== MINISTRY MEMBER TYPES =====
export interface CreateMinistryMemberRequest {
  id?: string;
  ministryId: string;
  personId: string;
  role?: string;
  status: MinistryStatus;
}

export interface UpdateMinistryMemberRequest extends Partial<CreateMinistryMemberRequest> {
  id: string;
}

export interface MinistryMemberResponse {
  success: boolean;
  data: MinistryMember;
  message?: string;
}

export interface MinistryMembersResponse {
  success: boolean;
  data: MinistryMember[];
  message?: string;
}

// Para obtener los miembros de un ministerio específico
export interface MinistryMembersByMinistryResponse {
  success: boolean;
  data: MinistryMember[];
  message?: string;
}
