# AI Chat UI

## Objective
This project implements a frontend-only, polished AI chat interface prototype inspired by leading AI platforms. It demonstrates key AI chat features with a focus on responsive UI, theming, and user experience using Next.js, React, TypeScript, and Tailwind CSS.

## Research

### AI Platforms Reviewed

**OpenAI ChatGPT**  
  A clean chat-based UI designed for ease of use and context continuity. Features include persistent conversation history, light/dark mode, and quick prompt input.

**Microsoft Copilot**  
  AI assistant integrated closely with developer workflows, featuring intelligent code suggestions and contextual understanding.

**Anthropic Claude**  
  Privacy-focused conversational AI with a minimalist interface that emphasizes simple, effective chat interactions.

### Features Chosen for This Project

- Model selector dropdown  
- Prompt editor text area with multi-line input  
- Parameter panel with sliders for temperature and max tokens  
- Dynamic theming with light & dark mode toggle  
- Responsive layout suitable for desktop and mobile  
- Conversation management sidebar  
- Copy and download response JSON functionality


## Design

The UI was first mocked up in [Figma]([https://www.figma.com/file/your-design-link](https://www.figma.com/design/YAqvoixTqT53NRs1auTs1C/AI-Chat-UI-Mockup?node-id=0-1&p=f&t=iPzJiDepiLy1c0JE-0)). Key design decisions include:

- **Spacing and Layout:** Utilized Tailwind’s padding, margin, and flex utilities to replicate design spacing precisely. The sidebar has fixed width (`w-80`), while the main content flexes to fill space.
- **Color Scheme:** Adopted Tailwind CSS colors and custom CSS variables for dark and light themes, ensuring consistent color tokens between design and code.
- **Typography:** Tailwind font sizes and line heights were matched to the mockup for readability and clean appearance.
- **Interactive Elements:** Buttons and input fields follow accessible standards with clear focus states and smooth transitions.

---

## Development

- Built entirely with **Next.js (App Router)** using **React functional components** and **TypeScript** for type safety.
- **Tailwind CSS** powers all styling with global styles in `globals.css`.
- Uses **mock API routes** (`/src/app/api/`) to simulate fetching AI models and templates for demonstration.
- Implements state management via React hooks and React Context for theme and conversation states.
- Supports **keyboard shortcuts** for new chat (`Ctrl+N`) and sending messages (`Ctrl+Enter`).
- Persistence of theme preference in `localStorage` to remember dark/light mode.
- Includes **copy to clipboard** and **download JSON** for response management.
- Responsive design works well on various screen sizes.
  
### Known Limitations

- No real AI backend; responses are mocked or static.
- Error handling and loading states are minimal.
- Storybook setup and accessibility audits are pending for next iteration.

---

## Mock API Setup

Two simple API endpoints were created inside `src/app/api`:

- `/api/models` — Returns a JSON array of available AI models with their max tokens.
- `/api/templates` — Returns sample prompt templates.

These serve as stand-ins for a real backend to enable frontend development without external dependencies.

---

## How to Run Locally

1. Clone the repo.  
2. Run `npm install` or `yarn` to install dependencies.  
3. Start the dev server: `npm run dev` or `yarn dev`.  
4. Visit `http://localhost:3000` in your browser.

---

## Deployment

The app is deployed live on [Vercel](https://ai-chat-ui-ashy.vercel.app) with auto-deploy on every GitHub push.

---

## Future Work

- Integrate a real AI backend with streaming responses.  
- Complete Storybook for core components with accessibility tests.  
- Add user authentication and persistent chat history.  
- Enhance error handling and loading feedback.  
- Expand template saving and loading capabilities.

---

## Design Assets

- Figma link: [Your Figma File]([https://www.figma.com/file/your-design-link](https://www.figma.com/design/YAqvoixTqT53NRs1auTs1C/AI-Chat-UI-Mockup?node-id=0-1&m=dev&t=eXGAEHItwoLBPArD-1))  
- Images and icons stored in `/public/assets`

---

## License

MIT License © Mohitkhichar
