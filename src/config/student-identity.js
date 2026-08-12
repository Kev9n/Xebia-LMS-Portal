/**
 * TEMPORARY STUDENT IDENTITY CONFIGURATION
 *
 * Authentication is intentionally NOT implemented in this phase.
 * The X-User-Id is a temporary development mechanism.
 * The future API Gateway/IAM service will populate this header
 * after JWT validation.
 *
 * No backend refactoring should be required when IAM is integrated.
 * This is the ONLY place where the temporary student identity is stored.
 */
export const TEMPORARY_STUDENT_ID = "00000000-0000-0000-0000-000000000001";
