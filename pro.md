Yes. For this project, I'd structure it as:

Stack
React for the frontend
Vite for the React build/dev environment
Tailwind CSS for styling
Vanilla JavaScript for small browser interactions where React isn't necessary
Neon PostgreSQL for the database
Vercel Blob for storing uploaded NYSC ID cards
SweetAlert2 for success/error alerts
Vercel for deployment

One correction: Neon and Blob aren't the backend by themselves. We'll use a server-side API layer on Vercel, with Neon handling database operations and Vercel Blob handling files.

Architecture
                    USER
                      │
                      ▼
              React + Vite
              Tailwind CSS
              Vanilla JS
                      │
                      ▼
              Vercel Server API
                 /api/...
                │        │
                ▼        ▼
          Neon PostgreSQL  Vercel Blob
          Registration     NYSC ID Cards
          Admin data       Uploaded files
Registration
/register

Venue verification
       ↓
At venue?
  ├── No → "You are not at the registration venue"
  │
  └── Yes
        ↓
Registration form
        ↓
NYSC ID upload → Blob
        ↓
Submit
        ↓
Spinner
        ↓
Backend validation
        ↓
SweetAlert
Admin
/admin

Dashboard
Registrations
├── Pending
├── Confirmed
└── Rejected

Venue Settings

Exports
├── CSV
├── Excel
└── PDF

For the database, I'd use PostgreSQL on Neon, with tables such as:

admins
registrations
venues
registration_logs

And the registration record would contain the selected Osun LGA, state code, account information, ID-card Blob URL, verification status, and registration timestamps.

This stack is a good fit for a lightweight registration portal and avoids introducing Laravel or another PHP framework.

Not the home page is just the registration form etc: 

Correct. If this is a single-purpose registration portal, we don't need a traditional home page or landing page.

The application can open directly to the registration form.

Application structure
/
└── Registration Form

/admin
└── Admin Login

/admin/dashboard
└── Dashboard

/admin/registrations
└── All Registrations

/admin/registrations/:id
└── Registration Details

/admin/settings
└── Venue + System Settings
/ Registration page

The only public page is the registration form.

At the top:

Osun Corps Members Registration

Then:

Full Name
[________________________]

Upload NYSC ID Card
[ Choose File ]

Phone Number
[________________________]

Email
[________________________]

Local Government
[ Select LGA ▼ ]

State Code
[________________________]

Bank Name
[ Select Bank ▼ ]

Account Name
[________________________]

Account Number
[________________________]

                    [ Submit ]

Before the form can be submitted, the system checks whether the user is at the single designated registration venue.

If they're outside:

You are not at the registration venue.

If they're inside, they can submit.

On submission:

[ ⟳ Submitting... ]

Then SweetAlert:

Registration Successful
Your registration has been submitted successfully.

No unnecessary pages

We don't need:

Home
About
Services
Contact
Public dashboard
Public login
Landing-page sections

It's simply a registration portal, with the admin system separated from the public form.

Stack: React + Vite + Tailwind CSS + Vanilla JS + Neon PostgreSQL + Vercel Blob + Vercel API.

Name NBC osun use coke cola red and white as color : create prompt MVP prd epr 

Below is a complete build specification for NBC Osun, focused strictly on the corps-member registration workflow and admin management.

NBC Osun Registration Portal — MVP / PRD / EPR
NBC OSUN
Corps Member Registration & Verification Portal
1. Project Overview

Build a simple, secure web-based registration portal named NBC Osun for registering corps members attending a single physical registration venue in Osun State.

The public-facing application should open directly to the registration form. There is no traditional homepage or landing page.

The visual identity should use a Coca-Cola-inspired red and white color direction:

Primary: red
Secondary: white
Supporting colors: dark neutral tones for text and borders
Clean, professional, simple interface
Do not create a flashy AI-generated-looking UI
Use a clean registration-form layout
Responsive on mobile, tablet, and desktop

Note: If this is intended for an official Coca-Cola/NBC deployment, use the organization's approved brand assets, logo, and brand guidelines rather than recreating proprietary Coca-Cola branding.

2. Technology Stack
Frontend
React
Vite
Tailwind CSS
Vanilla JavaScript where appropriate
SweetAlert2
Responsive HTML5
Backend/API

Use server-side API routes/functions deployed through Vercel.

Do not use Laravel.

Database

Neon PostgreSQL

Used for:

Registrations
Admin accounts
Venue configuration
LGA data
Verification status
Audit logs
System settings
File Storage

Vercel Blob

Used for uploaded NYSC/Corps Member ID cards.

Do not store uploaded ID-card files directly inside PostgreSQL.

Store the secure Blob reference/URL and associated metadata in PostgreSQL.

Deployment
Vercel
GitHub
Environment variables for secrets
Production HTTPS
3. Application Structure

There is no public homepage.

The root URL opens directly to the registration form.

/
└── Registration Form

/admin
└── Admin Login

/admin/dashboard
└── Dashboard

/admin/registrations
└── Registration Management

/admin/registrations/:id
└── Registration Details

/admin/settings
└── System Settings

/admin/venue
└── Registration Venue

/admin/exports
└── Export Management

The /admin area must not be advertised or linked from the public registration page.

4. Public Registration Form

The root page should display:

NBC OSUN
Corps Member Registration

Fields:

Full Name
NYSC/Corps Member ID Card
Phone Number
Email Address
Local Government Area
State Code
Bank Name
Account Name
Account Number

Additional fields should be configurable where necessary.

5. NYSC ID Card Upload

The user uploads their physical NYSC/Corps Member ID card as an image or PDF.

Allowed formats:

JPG
JPEG
PNG
WEBP
PDF

The frontend should validate:

File type
File size
Empty upload

The backend must validate these again.

Upload flow:

User selects ID card
        ↓
Frontend validation
        ↓
Backend validation
        ↓
Upload to Vercel Blob
        ↓
Store Blob reference in Neon

The uploaded ID should not be placed in a publicly accessible application folder.

Admin users can view the uploaded document from the registration details page.

6. Osun LGA Selection

The corps member should select their Local Government Area from a predefined Osun State LGA list.

Example:

Select Local Government

Atakunmosa East
Atakunmosa West
Ayedaade
Ayedire
Boluwaduro
Boripe
Ede North
Ede South
Egbedore
Ejigbo
Ife Central
Ife East
Ife North
Ife South
Ila
Ilesa East
Ilesa West
Irepodun
Irewole
Isokan
Iwo
Obokun
Odo Otin
Ola Oluwa
Olorunda
Oriade
Orolu
Osogbo

The final implementation should verify the official Osun LGA list before deployment.

The selected LGA has no relationship with the physical venue restriction.

All LGAs register at the same venue.

7. Registration Venue Restriction

There is only one physical registration venue.

The admin should be able to configure the venue manually.

Example:

Venue Name:
NBC Osun Corps Member Registration Venue

Venue Address:
[Admin enters venue address]

Allowed Radius:
[100] metres

Registration:
OPEN

The admin should not have to manually enter latitude and longitude.

The system may internally obtain the geographic coordinates from the manually entered venue address through a geocoding service.

The coordinates should remain an internal system value.

8. Location Verification

Before registration can proceed, the system checks the user's device location against the configured registration venue.

Flow:

Open registration page
        ↓
Request location permission
        ↓
Obtain device location
        ↓
Compare against configured venue
        ↓
Is user inside allowed area?
       / \
     YES  NO
      ↓    ↓
   Enable  Block
    form   form

If the user is outside:

You are not at the registration venue.

Registration can only be completed at the
designated registration venue.

The form should not allow submission while the location requirement has failed.

If the user is inside:

✓ You are at the registration venue.

You may proceed with registration.

Location verification must be enforced server-side as well as client-side where technically possible.

Do not rely solely on frontend JavaScript.

9. Registration Form UX

Keep the interface simple.

No unnecessary animations.

No complicated dashboard-style UI.

Use:

White background
NBC Osun red accents
Red primary buttons
Clear labels
Rounded but restrained form controls
Good spacing
Mobile-first responsive layout

The main button must be:

Submit

Not:

Register Now
Continue
Proceed
Create Account
10. Submit Interaction

When the user clicks Submit:

Step 1

Validate the form.

Step 2

Check location eligibility.

Step 3

Disable the Submit button.

Step 4

Display a simple spinner:

⟳ Submitting...
Step 5

Send registration data to the backend.

Step 6

Store the registration in Neon.

Step 7

Upload/store the ID card through Vercel Blob.

Step 8

Return a successful response.

Step 9

Display SweetAlert2:

Registration Successful

Your registration has been submitted successfully.

Use an appropriate confirmation action such as:

OK

On failure:

Submission Failed

Please check your information and try again.

Prevent duplicate submissions.

11. Registration Reference Number

Every successful registration should receive a unique registration reference.

Example:

NBC-OSUN-2026-000001

The reference should be generated server-side.

Display it after successful registration:

Registration Successful

Registration Reference:
NBC-OSUN-2026-000001
12. Registration Status

Each registration should have a status.

pending
confirmed
rejected

Default:

pending

Only authorized administrators can change the status.

13. Admin Authentication

Create a separate admin authentication system.

Admin login:

/admin

Fields:

Email
Password

Use secure password hashing.

Recommended:

Argon2id

Implement:

Secure sessions/tokens
Session expiration
Login rate limiting
CSRF protection where applicable
Secure cookies
Authentication middleware
Authorization checks
Logout
Failed-login protection

Never expose admin credentials in frontend code.

14. Admin Dashboard

Dashboard should show simple statistics:

Total Registrations
Pending
Confirmed
Rejected
Today's Registrations

Example:

Total
1,250

Pending
86

Confirmed
1,132

Rejected
32

Keep the dashboard clean and functional.

15. Registration Management

Admin should be able to:

View registrations
Search registrations
Filter registrations
Open individual registrations
View uploaded ID
Confirm registration
Reject registration
Add admin notes
View registration date/time
View selected LGA
View account information
View location verification result

Search by:

Name
Registration reference
Phone
Email
State code
LGA

Filters:

Status
LGA
Date
16. Individual Registration View

Example:

NBC OSUN

Registration:
NBC-OSUN-2026-000001

Full Name:
John Doe

LGA:
Osogbo

State Code:
OS/25C/1234

Phone:
080XXXXXXXX

Email:
example@email.com

Bank:
GTBank

Account Name:
John Doe

Account Number:
XXXXXXXXXX

NYSC ID:
[View ID Card]

Location:
✓ Verified at venue

Status:
Pending

Admin Note:
[________________________]

[ Confirm ]
[ Reject ]
17. Admin Venue Settings

The admin can configure the single registration venue.

Fields:

Venue Name
Venue Address
Allowed Radius
Registration Status

Example:

Venue Name:
NBC Osun Registration Venue

Address:
Osogbo, Osun State

Radius:
100 metres

Registration:
OPEN

Admin actions:

Save Venue
Open Registration
Close Registration

When registration is closed, the public form should display:

Registration Closed

Registration is currently unavailable.
18. Export System

The admin must be able to export registration records.

Supported formats:

CSV
.csv
Excel
.xlsx
PDF
.pdf

Exports should support filtering.

Example:

LGA:
Osogbo

Status:
Confirmed

Date:
01/09/2026 - 23/09/2026

[Export CSV]
[Export Excel]
[Export PDF]

The exported data should reflect the current filters.

Possible columns:

Registration Reference
Full Name
Phone
Email
LGA
State Code
Bank Name
Account Name
Account Number
Status
Location Verification
Registration Date
Verified Date

Do not include unnecessary sensitive information unless the admin is authorized to export it.

19. Database Design
admins
id
name
email
password_hash
role
is_active
created_at
updated_at
registrations
id
registration_reference
full_name
id_card_blob_url
id_card_filename
id_card_type
phone
email
lga
state_code
bank_name
account_name
account_number
location_verified
location_accuracy
status
admin_note
verified_by
verified_at
created_at
updated_at
venues
id
name
address
latitude
longitude
radius
is_active
created_at
updated_at

The latitude/longitude fields are internal system fields populated automatically from the manually entered address.

The admin does not need to enter them.

registration_logs
id
registration_id
admin_id
action
description
created_at

Use logs for important actions such as:

Registration confirmed
Registration rejected
Registration edited
Venue changed
Registration reopened
Registration closed
20. Security Requirements

Implement at minimum:

Server-side validation
Client-side validation
Parameterized SQL queries
Secure authentication
Argon2id password hashing
Rate limiting
Secure sessions
HTTPS
Environment variables
No hard-coded secrets
File upload validation
File-size restrictions
MIME/type validation
Secure Blob access
Authorization on every admin endpoint
Audit logging
CSRF protection where applicable
Security headers
Input sanitization
Output escaping
Duplicate-submission protection

Sensitive account information should never be exposed through public endpoints.

21. Environment Variables

Use environment variables for:

DATABASE_URL
BLOB_READ_WRITE_TOKEN
AUTH_SECRET
GEOCODING_API_KEY

Never commit these to GitHub.

Provide:

.env.example

with placeholder values only.

22. API Structure

Example:

POST /api/location/check

POST /api/registrations

GET /api/registrations

GET /api/registrations/:id

PATCH /api/registrations/:id

POST /api/registrations/:id/confirm

POST /api/registrations/:id/reject

GET /api/exports/csv
GET /api/exports/excel
GET /api/exports/pdf

POST /api/admin/login
POST /api/admin/logout

GET /api/admin/settings/venue
PATCH /api/admin/settings/venue

Protect every admin endpoint.

23. Location Security

Do not trust the frontend's:

locationVerified: true

The backend must independently validate the submitted location data.

Implement reasonable anti-abuse controls around:

Location spoofing
Repeated submissions
Request flooding
Invalid coordinates
Suspicious requests

Location verification should be treated as an eligibility check, not as absolute proof of physical presence.

24. File Storage

Vercel Blob should handle the uploaded ID cards.

Recommended flow:

User
 ↓
React
 ↓
API
 ↓
Validate file
 ↓
Vercel Blob
 ↓
Return file reference
 ↓
Neon

The database stores the reference, not the actual file binary.

25. MVP Scope
Must have
Public registration form
Osun LGA selection
NYSC ID upload
Account details
Single registration venue
Location verification
Submit button
Loading spinner
SweetAlert2
Registration reference
Admin login
Admin dashboard
Registration list
Registration details
Confirm/reject
Search/filter
Venue settings
Registration open/close
CSV export
Excel export
PDF export
Neon database
Vercel Blob
Responsive design
Not required for MVP
Public user accounts
Public login
Messaging system
Payments
Notifications
Complex analytics
Multiple registration venues
Multiple organizations
Mobile application
Public homepage
Social login
26. EPR: Engineering/Product Requirements
Functional requirements

FR-001
The root route must display the registration form.

FR-002
A user must provide all required information before submission.

FR-003
A user must upload a valid NYSC/Corps Member ID card.

FR-004
A user must select an Osun LGA.

FR-005
The system must verify venue eligibility before accepting registration.

FR-006
Users outside the configured venue must not be able to complete registration.

FR-007
The backend must validate registration data.

FR-008
Every successful registration must receive a unique reference.

FR-009
Admins must be able to review registrations.

FR-010
Admins must be able to confirm or reject registrations.

FR-011
Admins must be able to export records.

FR-012
Admins must be able to configure the registration venue.

FR-013
Admins must be able to open or close registration.

27. UI Requirements

Use Tailwind CSS.

Design language:

Primary:
NBC/Coca-Cola-style red

Background:
White

Text:
Dark neutral

Borders:
Light neutral

Success:
Standard green

Error:
Standard red

Do not overuse gradients.

Do not use glassmorphism.

Do not create a futuristic AI dashboard.

Keep the interface similar to a professional real-world registration portal.

Mobile should be the primary consideration because most corps members will access the form from their phones.

28. Final User Flow
                USER
                  │
                  ▼
            Open NBC Osun
                  │
                  ▼
         Check Registration Status
                  │
          ┌───────┴───────┐
          │               │
        CLOSED           OPEN
          │               │
          ▼               ▼
   Registration       Check Location
      Closed               │
                    ┌──────┴──────┐
                    │             │
                  OUTSIDE        INSIDE
                    │             │
                    ▼             ▼
              Not at Venue    Show Form
                                  │
                                  ▼
                          Fill Registration
                                  │
                                  ▼
                            Upload NYSC ID
                                  │
                                  ▼
                                Submit
                                  │
                                  ▼
                               Spinner
                                  │
                                  ▼
                            Backend Check
                                  │
                                  ▼
                         Save to Neon + Blob
                                  │
                                  ▼
                            SweetAlert
                                  │
                                  ▼
                         Registration Ref.
29. Admin Flow
/admin
   ↓
Admin Login
   ↓
Dashboard
   ↓
Registrations
   ↓
View Registration
   ↓
Inspect NYSC ID
   ↓
Review Information
   ↓
Confirm / Reject
   ↓
Audit Log

For exports:

Registrations
      ↓
Apply Filters
      ↓
CSV / Excel / PDF
30. Development Rule

Build the project incrementally.

First implement:

Vite + React
Tailwind CSS
Public registration form
Neon connection/API
Vercel Blob upload
Venue/location verification
Registration submission
SweetAlert2 + loading state
Admin authentication
Admin dashboard
Registration management
Venue settings
CSV export
Excel export
PDF export
Security hardening
Production deployment

Do not unnecessarily modify or introduce unrelated functionality.

The final product should remain a simple NBC Osun corps-member registration and verification portal, not a general-purpose CRM or complex management system.

Add a clear consent and privacy flow
Define duplicate registration handling