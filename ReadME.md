# PulseCheck – SaaS Uptime & Performance Monitoring Platform

PulseCheck is a full-stack SaaS application that monitors the availability and performance of websites and APIs. It periodically checks configured endpoints, tracks uptime and response time, logs failures, and presents all metrics through a clean dashboard.

The system is inspired by real-world monitoring tools (e.g., UptimeRobot) and is designed with production-grade backend architecture, background workers, and scalable scheduling.

## Features

### Authentication
- User signup & login
- JWT-based authentication
- Secure access to user-specific monitors

### Website & API Monitoring
- Monitor HTTP/HTTPS endpoints
- Configurable check intervals
- Automatic availability checks
- Response time measurement
- Status code tracking

### Background Worker System
- Periodic health checks using background workers
- Job scheduling based on timestamps (no per-user cron jobs)
- Shared worker pool for scalability
- Safe execution with failure handling

### Metrics & Analytics
- Uptime percentage calculation
- Response time history
- Failure reason classification (timeout, 4xx, 5xx, network errors)
- Aggregated daily & hourly statistics

### Dashboard
- Real-time UP / DOWN status
- Performance graphs
- Monitoring logs with timestamps
- Service health overview (SaaS-style UI)

### Alerts (MVP)
- Automatic detection of downtime
- Status change tracking
- Alert hooks (extensible for email/webhooks)

## System Design Highlights

- **Separation of concerns** between:
  - API server (user interaction)
  - Worker processes (background monitoring)
  - Database (persistent storage)
- Scalable worker-based architecture
- Time-based scheduling using `nextCheckAt`
- Designed for horizontal scaling
- External monitoring (checks from server perspective)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- React.js
- REST API integration
- Charting library (for metrics visualization)

### Infrastructure & DevOps
- Docker & Docker Compose
- AWS (EC2 deployment)
- Environment-based configuration
- Production-ready folder structure

## Project Structure

```
backend/
├── api/          # Express API server
├── worker/       # Background monitoring workers
├── models/       # Database schemas
├── routes/       # API routes
├── utils/        # Shared utilities
└── config/       # Environment & app config

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── hooks/
```

## Testing Strategy

- Real HTTP checks against public URLs
- Failure simulation (timeouts, invalid domains)
- Load testing with multiple monitors
- Production-like testing on AWS EC2

## Deployment

PulseCheck is containerized using Docker and deployed on AWS EC2. The same setup works locally and in production using Docker Compose.

## Screenshots

Screenshots and demo videos will be added after core features are completed.

## Roadmap

### Planned Features
- Email & webhook alerts
- Multi-endpoint monitoring per service
- Status pages (public uptime pages)
- Multi-region checks
- Role-based access (team accounts)
- Performance trend insights

## Project Status

⚠️ **Currently under active development**

More features, optimizations, and UI improvements are coming soon.