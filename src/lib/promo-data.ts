import type { Coupon, Review } from "./types";

export const COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "10% off your first order",
    firstOrderOnly: true,
    stackable: false,
  },
  {
    code: "LAUNCH25",
    type: "percentage",
    value: 25,
    description: "25% off — launch celebration",
    minOrderValue: 1500,
    usageLimit: 500,
    expiresAt: "2026-09-30",
    stackable: false,
  },
  {
    code: "FLAT200",
    type: "fixed",
    value: 200,
    description: "₹200 off orders over ₹1,000",
    minOrderValue: 1000,
    stackable: false,
  },
  {
    code: "FREESHIP",
    type: "free-shipping",
    value: 0,
    description: "Free shipping, no minimum",
    stackable: true,
  },
  {
    code: "FRIEND50",
    type: "fixed",
    value: 50,
    description: "Referral reward — ₹50 off",
    oneTimeUse: true,
    stackable: true,
  },
];

export function findCoupon(code: string): Coupon | undefined {
  return COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
}

export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Ananya R.",
    location: "Surat, IN",
    rating: 5,
    text: "The Amistrié Layer Vase looks better in person than in photos. Print quality is genuinely gallery-level.",
    date: "2026-06-02",
  },
  {
    id: "r2",
    name: "Devon M.",
    location: "Austin, US",
    rating: 5,
    text: "Ordered a custom nameplate for my desk. Turnaround was fast and the finish was flawless.",
    date: "2026-05-18",
  },
  {
    id: "r3",
    name: "Priya K.",
    location: "Ahmedabad, IN",
    rating: 4,
    text: "Dice tower is a hit at every game night. Wish the base color options were a bit wider, otherwise perfect.",
    date: "2026-04-30",
  },
  {
    id: "r4",
    name: "Marco T.",
    location: "Milan, IT",
    rating: 5,
    text: "Uploaded my own STL for a bracket repair and the estimate matched the final price almost exactly.",
    date: "2026-04-11",
  },
  {
    id: "r5",
    name: "Sara L.",
    location: "Leeds, UK",
    rating: 5,
    text: "The drawer organizer kit made my desk usable again. Snap-fit tolerances are spot on.",
    date: "2026-03-22",
  },
];
