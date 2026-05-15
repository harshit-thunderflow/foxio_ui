# Foxio - Reusable SaaS Widget

Foxio is a reusable SaaS widget built by **Intellectra Innovations**, designed to run inside an iframe with full Shadow DOM style isolation.

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- Radix UI + shadcn/ui (component library)
- React Router (MemoryRouter for iframe)
- Lucide React (icons)
- pnpm (package manager)

## Architecture

- **Shadow DOM Isolation** — No style leakage in/out
- **MemoryRouter** — No reliance on browser URL (iframe-safe)
- **Prop-based Config** — Title, logo, initial route, theme, onClose
- **Feature-based Modules** — Each page is a self-contained feature

## Project Structure

```
src/
├── app/
│   ├── layout/          # AppLayout (Sidebar + Header + Outlet)
│   ├── router/          # MemoryRouter + route definitions
│   ├── providers/       # ThemeProvider, FoxioProvider
│   ├── config.ts        # FoxioConfig type + defaults
│   ├── FoxioApp.tsx     # Main composable app component
│   └── ShadowRootWrapper.tsx  # Shadow DOM isolation
├── components/
│   ├── common/          # AppHeader, Sidebar
│   └── ui/              # shadcn/ui primitives
├── features/
│   ├── dashboard/
│   ├── library/
│   ├── video/
│   ├── chatbot/
│   └── profile/
├── hooks/               # Custom hooks
├── lib/                 # Utilities (cn)
├── services/            # API layer
├── utils/               # Helpers
├── App.tsx              # Re-export for backward compat
├── main.tsx             # Entry: ShadowRoot + FoxioApp
└── index.css            # Global styles & themes
```

## Getting Started

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Configuration

```tsx
<FoxioApp
  config={{
    title: "Foxio",
    logo: "/fox.png",
    initialRoute: "/dashboard",
    theme: "light",
    onClose: () => console.log("closed"),
  }}
/>
```

## Iframe Embedding

```html
<iframe src="https://your-foxio-deployment.com" style="width:100%;height:100%;border:none;"></iframe>
```

The app uses `h-screen w-full` layout with a persistent sidebar. The close button in the header only appears on small screens.

## Shadow DOM

The entire React tree renders inside a Shadow DOM root, ensuring:
- No external CSS overrides widget styles
- No widget styles leak to the host page
- Fonts and theme variables are scoped
