// src/data/mockData.ts
// MOCK_COMPLAINTS and MOCK_TRICYCLES are DELETED -- they live in db.json
// now, and the app fetches them through src/api/client.ts.
//
// `officerUser` stays. There is no /users endpoint and no real login
// until Module 4 -- the Dashboard's officer is still hard-coded, on purpose.

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export const officerUser: User = {
  id: 1,
  name: "Officer Juan dela Cruz",
  email: "juan.delacruz@traffic.gov.ph",
  role: "Traffic Enforcer",
  isActive: true,
};
