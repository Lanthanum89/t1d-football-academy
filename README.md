# T1D Football Academy

An installable football-themed learning app for young children living with type 1 diabetes.

The academy uses short activities to build confidence around noticing body signals, speaking to trusted adults and understanding that diabetes care is a team effort. It is intentionally **not** a glucose tracker, insulin calculator or medical decision tool.

## Current scaffold

- React, TypeScript and Vite
- Installable PWA with offline app-shell support
- Responsive 1990s football-magazine matchday hub
- Original illustrated player and lion mascot artwork
- First playable `Call the Coach` challenge with a short, staged interaction
- Optional spoken instructions through the browser speech API
- Reduced-motion support and large touch targets
- Vitest and Testing Library coverage
- GitHub Actions checks for lint, tests, build and production dependency audit
- Dependabot configuration

## Planned activities

1. **Call the Coach**: practise telling a trusted adult when something feels different
2. **Pack the Kit Bag**: learn which familiar T1D items travel with the team
3. **Half-Time Check**: normalise pausing for an adult-led check
4. **Meet the Team**: introduce insulin, glucose, food, movement, devices and trusted adults

## Safety boundaries

- No insulin calculations or treatment recommendations
- No interpretation of glucose readings
- No rewards or judgement attached to readings, food, injections or time in range
- Symptoms are prompts to tell a trusted adult, never a diagnosis
- No personal medical data, accounts, adverts or analytics
- Content should be checked against the child's individual care plan and reviewed with their diabetes team before wider use

See [SAFETY.md](./SAFETY.md) before adding health-related content.

## Local development

```bash
npm install
npm run dev
```

Before committing:

```bash
npm run lint
npm test
npm run build
```

## Architecture direction

React owns the installable app shell, menus and accessible game UI. Future 2D mini-games can use Phaser inside isolated game modules. Game rules and serialisable progress should remain separate from rendering so activities can be tested without a canvas.

## Privacy

Do not commit a child's full name, medical identifiers, glucose data, photographs, school information or individual treatment quantities.
