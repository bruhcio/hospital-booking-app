<div align="center">

# Hospital Booking App

A mobile-first hospital booking prototype for appointments, walk-in queues, visit history, and multilingual patient flows.

![Status](https://img.shields.io/badge/status-MVP-0A1317?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-0064E0?style=for-the-badge)
![Scope](https://img.shields.io/badge/scope-healthcare%20UX-444950?style=for-the-badge)

</div>

---

## Overview

Hospital Booking App is a `React + TypeScript` web prototype designed around the common hospital visit flow: booking an appointment, registering for a walk-in queue, checking wait status, and reviewing visit records.

The goal is to reduce repetitive reception steps and test a mobile healthcare UX before connecting to a real hospital backend.

## Core Flow

- Choose a medical service
- Select date, time, and doctor
- Enter patient information and symptoms
- Confirm an appointment
- Register for on-site waiting
- Check queue number and estimated waiting time
- Review visit and prescription history
- Switch between Korean, Vietnamese, and Thai text structure

## Stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| UI | Tailwind CSS, Radix UI, MUI |
| Interaction | motion, lucide-react |
| App shell | PWA manifest, service worker |
| Deploy | Vercel configuration |

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Current Scope

This is a frontend-centered MVP. Appointment data, queue numbers, and visit history are prototype data, not production hospital records.

## Next Steps

- Connect a real booking API and database
- Add patient authentication and privacy flow
- Build an admin dashboard for schedule and queue management
- Introduce SMS or Kakao notification flow
- Clean multilingual resources into an i18n structure
