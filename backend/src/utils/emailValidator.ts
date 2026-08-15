import dns from "dns";
import { AppError } from "../middleware/errorHandler.js";

/**
 * Disposable / dummy email domains that should be rejected.
 */
export const DUMMY_DOMAINS = [
  "now.com",
  "test.com",
  "example.com",
  "fake.com",
  "email.com",
  "ex.com",
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "dispostable.com",
  "maildrop.cc",
  "temp-mail.org",
  "10minutemail.com",
  "trashmail.com",
  "fakeinbox.com",
  "mailnesia.com",
  "getnada.com",
  "testone.com",
];

/**
 * Check whether a domain has at least one MX record.
 * Returns true if valid mail server exists, false otherwise.
 */
const hasMxRecords = (domain: string): Promise<boolean> => {
  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        // In some local or corporate networks, DNS MX queries fail even for valid domains like gmail.com.
        // We fail-open here so users don't get blocked due to local network DNS restrictions.
        console.warn(`[Warning] DNS MX lookup failed for ${domain}. Bypassing check to prevent blocking valid users.`);
        resolve(true);
      } else if (!addresses || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Validates that an email address:
 * 1. Has a valid format (regex)
 * 2. Is not from a known disposable/dummy domain
 * 3. Has a domain with real MX (mail exchange) records — proving
 *    the domain actually accepts email
 */
export const validateRealEmail = async (email: string) => {
  // 1. Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email address format", 400);
  }

  const domain = email.split("@")[1].toLowerCase();

  // 2. Block known disposable / dummy domains
  if (DUMMY_DOMAINS.includes(domain)) {
    throw new AppError(
      "Disposable or dummy email addresses are not allowed",
      400,
    );
  }

  // 3. DNS MX record lookup — verify the domain can actually receive mail
  const validMx = await hasMxRecords(domain);
  if (!validMx) {
    throw new AppError(
      "This email domain does not appear to accept emails. Please use a valid email address.",
      400,
    );
  }
};
