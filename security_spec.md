# Security Specification - Athar Tayyib (أثر طيب)

## 1. Data Invariants
1. A Memorial page must belong to an authenticated user (`userId == request.auth.uid`) upon creation.
2. Only the owner of a memorial page or a verified system admin (`ahammam25101972@gmail.com`) can update memorial page details or delete the page.
3. Visitors can interact by incrementing `visitCount` and `prayerCount` or writing prayers in `/memorials/{memorialId}/prayers/{prayerId}`.
4. The page owner can toggle `isHidden` on prayer sub-collection documents to moderate inappropriate prayers.
5. Suspended memorial pages cannot be updated by normal users.
6. Public reads for memorial pages are allowed if `isPublished == true` and `isSuspended != true` (or if the requester is the owner or admin).
7. Visitors can create Reports in `/reports/{reportId}` to report abuse, but only admins can list and update report statuses.

## 2. Dirty Dozen Test Payloads
1. **Payload 1 (Owner Spoofing on Memorial Create)**: Non-owner creates a memorial with someone else's `userId`. Expected: `PERMISSION_DENIED`.
2. **Payload 2 (Anonymous Memorial Creation)**: Unauthenticated user attempts to create a memorial. Expected: `PERMISSION_DENIED`.
3. **Payload 3 (Malicious Admin Escalation)**: User creates/updates their user document setting `role: "admin"`. Expected: `PERMISSION_DENIED`.
4. **Payload 4 (Unauthorized Memorial Edit)**: Authenticated user A tries to update a memorial owned by user B. Expected: `PERMISSION_DENIED`.
5. **Payload 5 (Oversized Memorial Name Injection)**: User sends `deceasedName` exceeding allowed limits (Denial of Wallet). Expected: `PERMISSION_DENIED`.
6. **Payload 6 (Shadow Key Injection)**: User updates memorial with unexpected arbitrary fields like `internalOverride: true`. Expected: `PERMISSION_DENIED`.
7. **Payload 7 (Report List Hijack)**: Regular authenticated user tries to list all user reports from `/reports`. Expected: `PERMISSION_DENIED`.
8. **Payload 8 (Visitor Modifying Memorial Details via Prayer Counter Action)**: Visitor tries to change `deceasedName` while sending an increment counter. Expected: `PERMISSION_DENIED`.
9. **Payload 9 (Deleted Page Resurrection)**: User tries to write to a non-existent memorial path with invalid characters. Expected: `PERMISSION_DENIED`.
10. **Payload 10 (Admin Role Bypass with Unverified Email)**: User with spoofed email header without verification claiming admin. Expected: `PERMISSION_DENIED`.
11. **Payload 11 (Prayer Text Abuse)**: Submitting a prayer with 50,000 characters. Expected: `PERMISSION_DENIED`.
12. **Payload 12 (Direct PII user doc read by arbitrary visitor)**: Anonymous or unrelated user reading private user doc. Expected: `PERMISSION_DENIED`.
