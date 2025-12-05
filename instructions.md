# Project Instructions

## Project Overview

This is a **Lovable** project built with a modern React tech stack. It leverages Shadcn UI for components, Tailwind CSS for styling, and Supabase for backend services (database, authentication).

**Key Technologies:**
-   **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **State Management & Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Backend/Database:** [Supabase](https://supabase.com/)
-   **Rich Text Editor:** [Tiptap](https://tiptap.dev/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Icons:** [Lucide React](https://lucide.dev/)

## Prerequisites

Ensure you have the following installed on your machine:
-   [Node.js](https://nodejs.org/) (LTS recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [Bun](https://bun.sh/)

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using bun:
    ```bash
    bun install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory (if it doesn't exist) and add the necessary Supabase credentials. You typically need:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
    ```
    *Note: If you are using Lovable, these might be automatically configured or provided.*

## Development

To start the local development server:

```bash
npm run dev
```

The application will typically run at `http://localhost:8080`.

## Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

-   `src/`
    -   `App.tsx`: Main application component.
    -   `main.tsx`: Entry point.
    -   `components/`: Reusable UI components.
    -   `pages/`: Page components corresponding to routes.
    -   `hooks/`: Custom React hooks.
    -   `lib/`: Utility functions (e.g., `utils.ts` for Tailwind class merging).
    -   `integrations/`: Integrations with external services like Supabase.
        -   `supabase/client.ts`: Supabase client initialization.
-   `supabase/`: Supabase configuration and migrations.
-   `public/`: Static assets.

## Database (Supabase)

This project uses Supabase. The client configuration is located in `src/integrations/supabase/client.ts`.

Ensure your Supabase project is set up correctly and the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) match your Supabase project settings.

## Styling

Styling is handled via Tailwind CSS. You can find the configuration in `tailwind.config.ts`.
Shadcn UI components are pre-styled but customizable via Tailwind classes.

## Linting

To lint the codebase:

```bash
npm run lint
```
