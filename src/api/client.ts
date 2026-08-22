// src/api/client.ts
// Every call to json-server lives in this one file.
import type { ApiTricycle } from "../types/index";

export const API_URL = "http://localhost:3001";

// This shape already matches what json-server returns -- id and
// created_at are strings from the start, so no Omit is needed here.
export interface Complaint {
  id: string;
  complaint_number: string;
  complainant_name: string;
  tricycle_body_number: string;
  violation_type: string;
  status: "Pending" | "Under Review" | "Resolved";
  created_at: string;
}

// What we SEND when filing a new complaint. No id yet -- the server makes it.
export type NewComplaint = Omit<Complaint, "id">;

// GET /complaints -> the whole list
export async function fetchComplaints(): Promise<Complaint[]> {
  const res = await fetch(`${API_URL}/complaints`);
  if (!res.ok) {
    throw new Error("Could not load complaints");
  }
  return res.json();
}

// GET /complaints/:id -> one complaint
export async function fetchComplaintById(id: string): Promise<Complaint> {
  const res = await fetch(`${API_URL}/complaints/${id}`);
  if (!res.ok) {
    throw new Error(`No complaint found with id "${id}".`);
  }
  return res.json();
}

// POST /complaints -> the row the server saved, with the id it made
export async function createComplaint(
  newComplaint: NewComplaint
): Promise<Complaint> {
  const res = await fetch(`${API_URL}/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComplaint),
  });
  if (!res.ok) {
    throw new Error("Could not save the complaint");
  }
  return res.json();
}

// GET /tricycles -> the whole list
export async function fetchTricycles(): Promise<ApiTricycle[]> {
  const res = await fetch(`${API_URL}/tricycles`);
  if (!res.ok) {
    throw new Error("Could not load tricycles");
  }
  return res.json();
}
