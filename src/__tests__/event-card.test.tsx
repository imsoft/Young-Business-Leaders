import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EventCard } from "@/components/site/event-card";
import type { Event } from "@/lib/types";

const event: Event = {
  id: "1",
  slug: "taller-finanzas",
  title: "Finanzas para Dummies",
  summary: "Taller práctico",
  description: null,
  starts_at: "2026-10-24T16:00:00.000Z",
  ends_at: null,
  location: "CCJEJ",
  address: null,
  cover_url: null,
  capacity: null,
  is_public: false,
  published: true,
  created_by: null,
  created_at: "2026-10-01T00:00:00.000Z",
  updated_at: "2026-10-01T00:00:00.000Z",
};

describe("EventCard", () => {
  it("enlaza al evento y marca los exclusivos de miembros", () => {
    render(<EventCard event={event} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/eventos/taller-finanzas");
    expect(screen.getByText("Solo miembros")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getByText("CCJEJ")).toBeInTheDocument();
  });
});
