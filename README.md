# Contract Manager

A modern, high-performance React application for designing blueprints, creating contracts, and managing their lifecycles. Built with a focus on premium aesthetics and seamless user experience.

## Features

- **Blueprint Builder**: Interactive drag-and-drop interface to design contract templates on an A4 canvas.
- **Contract Creation**: Instantiate contracts from blueprints with automatic field generation.
- **Digital Contracting**: Fill out contract fields (Text, Date, Checkbox) and sign digitally.
- **Lifecycle Management**: Track contract status through `CREATED` → `APPROVED` → `SENT` → `SIGNED` fields.
- **Security & Integrity**: Contracts can be locked or revoked, preventing further edits.
- **Dashboard**: Advanced filtering (Active, Pending, Signed) and management of all contracts.
- **Persistence**: All data is persisted locally using Zustand middleware.

## Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **State Management**: Zustand (with persistence)
- **Styling**: Vanilla CSS (Variables, Glassmorphism, CSS Modules approach)
- **Icons & Fonts**: Google Fonts (Inter)

## Folder Structure

```
src/
├── components/     # Reusable UI components (Header, Layout)
├── models/         # TypeScript interfaces (Contract, Blueprint, Field)
├── pages/          # Main application views
│   ├── Dashboard.tsx
│   ├── BlueprintList.tsx
│   ├── BlueprintBuilder.tsx
│   ├── CreateContract.tsx
│   └── ContractView.tsx
├── store/          # Zustand stores
│   ├── useAppStore.ts
│   ├── useBlueprintStore.ts
│   └── useContractStore.ts
├── utils/          # Helpers (lifecycle logic)
├── App.tsx         # Routing configuration
└── index.css       # Global design system & utilities
```

## State Management Approach

The application uses **Zustand** for a lightweight, scalable state solution.
- `useBlueprintStore`: Manages blueprint templates.
- `useContractStore`: Manages contract instances.
- **Persistence**: Both stores automatically sync with `localStorage`, preserving data across reloads.

## Contract Lifecycle Logic

Contracts follow a strict state machine defined in `src/utils/lifecycle.ts`:

1. **CREATED**: Initial state. Editable.
2. **APPROVED**: Reviewed and ready for sending. Editable.
3. **SENT**: Sent to signer. Editable.
4. **SIGNED**: Signed by the recipient. **Locked** (Read-only).
5. **LOCKED**: Finalized state. **Locked** (Read-only).
6. **REVOKED**: Cancelled/Voided. **Locked** (Read-only).

Status transitions are validated to ensure logical progression (e.g., you cannot go from `SIGNED` back to `CREATED`).

## Setup Instructions

1. **Prerequisites**: Node.js (v16+) and npm.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Build for Production**:
   ```bash
   npm run build
   ```

## Assumptions

- The app is currently client-side only; data persists to local storage.
- "Signature" is a simulated text field with a specialized font, not a cryptographic signature.
- Canvas layout is fixed to A4 dimensions for consistency.

## Limitations

- No backend integration (auth, real database).
- Drag-and-drop is restricted to the browser window viewport.
- PDF export is not currently implemented.
