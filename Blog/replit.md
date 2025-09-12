# Blog Platform - replit.md

## Overview

A full-stack blog platform built with React, TypeScript, Express, and PostgreSQL. The platform allows users to register, create blog posts, manage content, and engage with other authors through a modern, publishing-focused interface. Features include JWT authentication with Google OAuth, rich text editing, post categorization with tags, and a responsive design inspired by platforms like Medium and Notion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system supporting light/dark modes
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Content-first approach with Inter font, neutral color palette, and 8px grid system

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with OpenID Connect for Replit Auth integration
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with proper error handling and validation

### Database Schema
- **Users**: Profile management with email verification, bio, location, and social stats
- **Posts**: Content with titles, slugs, rich text content, cover images, and status tracking
- **Tags**: Categorization system with many-to-many relationships to posts
- **Engagement**: Like and follow systems for user interaction
- **Sessions**: Secure session storage for authentication persistence

### Authentication & Authorization
- **Primary Auth**: Replit OAuth with OpenID Connect protocol
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Email Verification**: SendGrid integration for account activation
- **Security**: CSRF protection, secure cookies, and JWT token handling

### Content Management
- **Rich Text Editor**: Custom editor component with formatting tools
- **Image Handling**: Cover image support with responsive display
- **SEO Optimization**: Auto-generated slugs and metadata for search engines
- **Draft System**: Save and publish workflow for content creation
- **Read Time Calculation**: Automatic estimation based on word count

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database via Neon serverless with connection pooling
- **Drizzle Kit**: Database migrations and schema management

### Authentication Services
- **Replit Auth**: OAuth provider for user authentication
- **OpenID Connect**: Authentication protocol implementation

### Email Services
- **SendGrid**: Transactional email service for verification and notifications

### UI/UX Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent visual elements
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Component variant management

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Production bundling
- **PostCSS**: CSS processing with Tailwind integration

### Query Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and API endpoints