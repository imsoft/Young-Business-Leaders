export type MemberStatus = "pending" | "approved" | "rejected";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  company: string | null;
  industry: string | null;
  city: string | null;
  instagram: string | null;
  linkedin: string | null;
  website: string | null;
  status: MemberStatus;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  address: string | null;
  cover_url: string | null;
  capacity: number | null;
  is_public: boolean;
  published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRegistration = {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  created_at: string;
};

export type GalleryAlbum = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  event_date: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type GalleryPhoto = {
  id: string;
  album_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  tier: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type Table<Row, Required extends keyof Row, Generated extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required | Generated>>;
  Update: Partial<Omit<Row, Generated>>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, "id" | "email", "created_at" | "updated_at">;
      events: Table<Event, "slug" | "title" | "starts_at", "id" | "created_at" | "updated_at">;
      event_registrations: Table<EventRegistration, "event_id", "id" | "created_at">;
      gallery_albums: Table<GalleryAlbum, "slug" | "title", "id" | "created_at">;
      gallery_photos: Table<GalleryPhoto, "album_id" | "url", "id" | "created_at">;
      sponsors: Table<Sponsor, "name", "id" | "created_at">;
      contact_messages: Table<ContactMessage, "name" | "email" | "message", "id" | "created_at">;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_approved_member: { Args: Record<string, never>; Returns: boolean };
      event_attendee_count: { Args: { event: string }; Returns: number };
    };
    Enums: { member_status: MemberStatus };
    CompositeTypes: Record<string, never>;
  };
};
