export const PRACTICE_NAME = "Better Women's Care";
export const PRACTICE_EMAIL = "bwc@betterwomenscare.com";

export const PRACTICE_ADDRESS = {
  street: "30445 Northwestern Highway, Suite 142",
  city: "Farmington Hills",
  state: "MI",
  zip: "48334",
  phone: "248-948-6900",
  fax: "248-948-6904",
} as const;

export const PRACTICE_PHYSICIANS = [
  "Lisa Cardwell, M.D.",
  "Kimberly Wallace, M.D.",
] as const;

/** Set to false when deploying for a licensed client. */
export const IS_DEMO = false;

export const TYMFLO = {
  email: "hello@tymflo.com",
  phone: "313-217-1082",
  website: "https://tymflo.com",
} as const;
