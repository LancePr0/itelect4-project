// src/data/mockData.ts
import type { Tricycle } from "../types/index";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface Complaint {
  id: string;
  complaint_number: string;
  complainant_name: string;
  tricycle_body_number: string;
  violation_type: string;
  status: "Pending" | "Under Review" | "Resolved";
  created_at: string;
}

export const officerUser: User = {
  id: 1,
  name: "Officer Juan dela Cruz",
  email: "juan.delacruz@traffic.gov.ph",
  role: "Traffic Enforcer",
  isActive: true,
};

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    complaint_number: "CMP-2026-001",
    complainant_name: "Maria Santos",
    tricycle_body_number: "123",
    violation_type: "Overcharging",
    status: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    complaint_number: "CMP-2026-002",
    complainant_name: "Pedro Penduko",
    tricycle_body_number: "456",
    violation_type: "Refusal to Convey Passenger",
    status: "Under Review",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    complaint_number: "CMP-2026-003",
    complainant_name: "Ana Reyes",
    tricycle_body_number: "789",
    violation_type: "Reckless Driving",
    status: "Resolved",
    created_at: new Date().toISOString(),
  },
];

export const MOCK_TRICYCLES: Tricycle[] = [
  { id: 101, plateNumber: "LP-1234", operatorName: "Juan dela Cruz", phoneNumber: "09171234567" },
  { id: 102, plateNumber: "LP-5678", operatorName: "Mario Reyes", phoneNumber: "09179876543" },
  { id: 103, plateNumber: "LP-9012", operatorName: "Ben Santos", phoneNumber: "09175551234" },
];
