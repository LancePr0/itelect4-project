// The test sits beside the file it tests, same name with .test in
// front of .tsx.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ComplaintCard from "./ComplaintCard";
import { ComplaintStatus } from "../types/index";
import type { ApiComplaint } from "../types/index";

// One complaint shaped exactly like a row from GET /api/complaints.
// Typed, so a field that does not exist on ApiComplaint is a compile
// error here too.
const complaint: ApiComplaint = {
  id: "665f1c2ab4e8d3a1f0c9e101",
  filedBy: "665f1c2ab4e8d3a1f0c9e001",
  tricycleId: "665f1c2ab4e8d3a1f0c9e050",
  complainantName: "Maria Santos",
  issueDescription: "Overcharged for a short trip to the market.",
  status: ComplaintStatus.PENDING,
  filedAt: "2026-10-20T07:45:00.000Z",
};

describe("ComplaintCard", () => {
  it("shows the tricycle's plate number when one is given", () => {
    render(<ComplaintCard complaint={complaint} tricyclePlate="LP-1234" />);

    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(
      screen.getByText("Overcharged for a short trip to the market."),
    ).toBeInTheDocument();
    expect(screen.getByText("Tricycle: LP-1234")).toBeInTheDocument();
  });

  it("falls back to the raw tricycle id when no plate was given", () => {
    render(<ComplaintCard complaint={complaint} />);

    expect(
      screen.getByText(`Tricycle: ${complaint.tricycleId}`),
    ).toBeInTheDocument();
  });

  it("hides the issue description in compact view", () => {
    render(<ComplaintCard complaint={complaint} variant="compact" />);

    expect(
      screen.queryByText("Overcharged for a short trip to the market."),
    ).not.toBeInTheDocument();
  });
});
