// Shared TypeScript types for NexMansion

export type Role = "TRAVELLER" | "HOST" | "ADMIN" | "SUPPORT";

export type BookingMode = "INSTANT" | "REQUEST";

export type PropertyStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "VERIFIED"
  | "PUBLISHED"
  | "REJECTED"
  | "SUSPENDED"
  | "ARCHIVED";

export type BookingStatus =
  | "DRAFT"
  | "REQUESTED"
  | "AWAITING_HOST"
  | "APPROVED"
  | "AWAITING_PAYMENT"
  | "PAYMENT_PROCESSING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLATION_REQUESTED"
  | "CANCELLED"
  | "REFUNDED"
  | "DECLINED"
  | "EXPIRED"
  | "DISPUTED";

export type PaymentStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type PaymentProvider = "STRIPE" | "CRYPTO" | "MANUAL";
export type ServicePriceModel = "FIXED" | "PER_GUEST" | "PER_DAY" | "PER_TRIP" | "QUOTE";

export interface Country {
  id: string;
  name: string;
  slug: string;
  iso_code: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  country_id: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  destination_id: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  hero_image_url: string | null;
  is_active: number;
  coming_soon: number;
  currency: string;
  destination_id: string;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  overview: string | null;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  size_sqm: number | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  hero_image_url: string | null;
  video_url: string | null;
  base_price_minor: number;
  currency: string;
  cleaning_fee_minor: number;
  service_fee_pct: number;
  tax_pct: number;
  security_deposit_minor: number;
  min_stay_nights: number;
  max_stay_nights: number | null;
  check_in_time: string;
  check_out_time: string;
  booking_mode: BookingMode;
  beachfront: number;
  ocean_view: number;
  jungle_view: number;
  pool: number;
  family_friendly: number;
  events_allowed: number;
  status: PropertyStatus;
  featured: number;
  verified_at: string | null;
  last_verified_at: string | null;
  cancellation_policy: string;
  host_id: string;
  collection_id: string | null;
  destination_id: string;
  region_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  region_name?: string;
  region_slug?: string;
  destination_name?: string;
  average_rating?: number | null;
  review_count?: number;
  is_favorite?: number;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  order_index: number;
}

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface HouseRule {
  id: string;
  property_id: string;
  title: string;
  description: string;
  order_index: number;
}

export interface Service {
  id: string;
  property_id: string;
  category: string;
  name: string;
  description: string | null;
  price_model: ServicePriceModel;
  price_minor: number;
  currency: string;
  active: number;
  lead_time_hours: number | null;
  capacity: number | null;
  requires_confirmation: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  password_hash: string | null;
  email_verified: string | null;
  phone: string | null;
  country: string | null;
  locale: string;
  currency: string;
  role: Role;
  suspended: number;
  created_at: string;
  updated_at: string;
}

export interface HostProfile {
  id: string;
  user_id: string;
  company_name: string | null;
  bio: string | null;
  verification_status: string;
  verification_notes: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  reference: string;
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  nights_subtotal_minor: number;
  cleaning_fee_minor: number;
  service_fee_minor: number;
  tax_minor: number;
  discount_minor: number;
  total_minor: number;
  currency: string;
  status: BookingStatus;
  special_requests: string | null;
  instant_book: number;
  cancellation_policy: string;
  terms_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  // joined
  property_name?: string;
  property_slug?: string;
  property_hero?: string | null;
  host_id?: string;
}

export interface ServiceOrder {
  id: string;
  booking_id: string;
  service_id: string;
  quantity: number;
  price_minor: number;
  status: string;
  note: string | null;
  created_at: string;
  service_name?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount_minor: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  provider_session_id: string | null;
  provider_payment_id: string | null;
  metadata: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  property_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string;
  host_reply: string | null;
  approved: number;
  created_at: string;
  author_first_name?: string | null;
  author_last_name?: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  subject: string | null;
  related_booking_id: string | null;
  related_property_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConciergeRequest {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  property_id: string | null;
  check_in: string | null;
  check_out: string | null;
  category: string;
  message: string;
  contact_method: string;
  occasion: string | null;
  urgency: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  assignee_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  booking_id: string;
  reporting_party_id: string;
  category: string;
  description: string;
  requested_resolution: string | null;
  status: string;
  admin_notes: string | null;
  decision: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: number;
  config: string | null;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: string | null;
  ip: string | null;
  created_at: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export interface AvailabilityBlock {
  id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  note: string | null;
  booking_id: string | null;
}

export interface PropertyVerification {
  id: string;
  property_id: string;
  host_identity: number;
  property_reviewed: number;
  listing_checked: number;
  imagery_reviewed: number;
  last_verified_at: string | null;
  reviewer_id: string | null;
  notes: string | null;
  expires_at: string | null;
}
