<<<<<<< HEAD
# Niks Jobs — Premium Job Portal

A modern, full-featured job portal built with **HTML5**, **CSS3**, and **Vanilla JavaScript**.

## Quick Start

Open `index.html` in your browser, or serve locally:

```bash
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080`

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Landing page with hero, search, categories, jobs |
| Jobs | `jobs.html` | Job listings with filters, sort, pagination |
| Job Details | `job-details.html` | Full job description and apply form |
| User Dashboard | `dashboard.html` | Applications, saved jobs, resume |
| Employer Dashboard | `employer-dashboard.html` | Post/manage jobs, applicants |
| Profile | `profile.html` | User profile with skills & experience |
| Company | `company.html` | Company profile and open jobs |
| Login | `login.html` | Authentication |
| Register | `register.html` | Sign up (job seeker / employer) |
| Forgot Password | `forgot-password.html` | Password reset |

## Features

- Dark / light mode toggle
- Job search, filters, sort, pagination & infinite scroll
- Save jobs (localStorage)
- Recently viewed jobs
- Job recommendations
- Notifications dropdown
- Application tracking timeline
- Chat & AI assistant popups
- Interview scheduler UI
- Form validation
- Responsive mobile-first design
- Scroll reveal animations & loading states

## Project Structure

```
├── index.html
├── jobs.html
├── job-details.html
├── dashboard.html
├── employer-dashboard.html
├── profile.html
├── company.html
├── login.html
├── register.html
├── forgot-password.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── animations.css
│   ├── components.css
│   ├── layout.css
│   ├── pages.css
│   └── responsive.css
├── js/
│   ├── data.js
│   ├── storage.js
│   ├── utils.js
│   ├── theme.js
│   ├── notifications.js
│   ├── jobs.js
│   ├── auth.js
│   └── app.js
└── assets/
    └── images/
```

## Authentication

**Register** a new account on the sign-up page, then log in with your email and password. Credentials are stored locally in your browser.

**Protected pages** (require login): Dashboard, Employer Dashboard, Profile. Visiting these while logged out redirects to the login page.

## Demo Data

40 job listings, 16 companies, 16 categories, 8 testimonials, 10 notifications, 12 applicant profiles, career resources, and top hiring locations are included in `js/data.js`. User actions (saved jobs, applications, theme, session) persist via `localStorage`.

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

---

© 2026 Niks Jobs
=======
# Job-Portal
>>>>>>> 3d7454039073bbfc46a3f641753241fa63d6b8ca
