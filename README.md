# EventSphere Frontend

A modern, type-safe React application for managing community events, RSVPs, and memberships. Built with performance and developer experience in mind.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **QR Codes**: [html5-qrcode](https://github.com/mebjas/html5-qrcode) & [react-qr-code](https://www.npmjs.com/package/react-qr-code)
- **HTTP Client**: [Axios](https://axios-http.com/)

## ✨ Key Features

- **Authentication**: Secure Login and Registration flows.
- **Event Management**:
  - Create, Edit, and Delete events.
  - Recurring event support (Daily, Weekly, Monthly).
  - **Interactive Location Picker** using Leaflet maps.
  - Image upload integration.
- **Community Hub**:
  - Join/Leave communities.
  - Community-specific event visibility.
  - Admin tools for managing members.
- **RSVP System**:
  - Real-time RSVP status (Going, Maybe, Not Going).
  - **QR Code Ticket Generation** for attendees.
  - **In-App QR Scanner** for organizers to validate tickets.
- **Dashboard**:
  - Personalized view of joined events and memberships.
  - Ticket wallet integration.
- **Type Safety**: strict TypeScript configuration with zero `any` policy in critical paths.

## 🛠️ Setup & Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repo-url>
    cd eventsphere/frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the `frontend` root (optional if using default local backend):
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173` (or the port shown in terminal).

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components (Button, Input, Modal, etc.)
├── constants/      # App-wide constants and config
├── features/       # Feature-specific components (EventForm, CommunityList)
├── hooks/          # Custom React hooks (useAuth, useDebounce)
├── layouts/        # Page layouts (MainLayout, AuthLayout)
├── pages/          # Route components
├── services/       # API services and Axios config
├── store/          # Redux store and slices
├── types/          # TypeScript interfaces and types
├── validators/     # Yup schema definitions
└── styles/         # Global styles and Tailwind config
```

## 🧪 Linting & Quality

This project uses ESLint with strict type-aware rules.
```bash
npm run lint
```

## 📝 Recent Updates

- **Strict Type Safety**: Refactored codebase to eliminate `any` types.
- **Map Integration**: Replaced conditional rendering with Map-based patterns for better scalability.
- **React 19 Compatibility**: Updated dependencies to support latest React features.

