// ===== ENUMS =====
export enum ComplaintStatus {
    PENDING = "PENDING",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED"
}

export const enum Role {
    Admin = "admin",
    Officer = "officer"
}


export interface User {
    id: number;
    name: string;
    email: string;
    role: Role; 
    isActive: boolean;
}

export interface Tricycle {
    id: number;
    plateNumber: string;
    operatorName: string;
    phoneNumber: string;
}

// Session 7: json-server writes ids as strings. ApiTricycle is what the
// API actually returns, derived from Tricycle so it stays in sync.
export type ApiTricycle = Omit<Tricycle, "id"> & { id: string };

export interface Complaint {
    id: number;
    // NEW for GT4 -- the original Session 1 interface never needed an
    // owner, because the frontend only ever had one hard-coded officer.
    // A resource with full CRUD scoped to "the token's user" needs one.
    filedBy: number;
    tricycleId: number;
    complainantName: string;
    issueDescription: string;
    status: ComplaintStatus;
    filedAt: Date;
}

// Session 10: what itelect4-backend actually sends back. id, filedBy and
// tricycleId are all 24-character Mongo ids once they cross the wire,
// and filedAt is an ISO string, never a Date object.
export type ApiComplaint = Omit<
  Complaint,
  "id" | "filedBy" | "tricycleId" | "filedAt"
> & {
  id:        string;
  filedBy:   string;
  tricycleId: string;
  filedAt:   string;
};

// What we SEND when filing a complaint. filedBy comes off the token on
// the server; status and filedAt are schema defaults. tricycleId here is
// the tricycle's real Mongo id (a string), picked from the dropdown --
// not the Session 1 interface's number.
export type NewComplaint = Omit<
  Pick<Complaint, "tricycleId" | "complainantName" | "issueDescription">,
  "tricycleId"
> & {
  tricycleId: string;
};

// What /api/auth/register sends back, and what sits inside the login
// reply.
export type ApiUser = Omit<User, "id"> & {
  id: string;
};

// What /api/auth/login sends back. The token is the string that goes in
// the Authorization header on every request after this one.
export interface AuthReply {
  token: string;
  user:  ApiUser;
}

export type ID = number | string;
export type StringOrNumber = string | number;


export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}


export type ComplaintUpdate = Partial<Complaint>;


export type PublicTricycleView = Omit<Tricycle, "phoneNumber">;


export type StatusCounts = Record<ComplaintStatus, number>;