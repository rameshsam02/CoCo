# CoCo - Multi-Agent Data Consultant

**CoCo** is an innovative multi-agent data consultant designed to assist users in exploring new business ventures or industries. By engaging in a conversational call, CoCo collects detailed descriptions from users about their target business or industry. It then leverages a team of intelligent agents to perform deep research, delivering a comprehensive presentation filled with factual content, resources, and actionable insights. With its natural language-powered PPT editor, users can customize presentations on the fly, making it a powerful tool for entrepreneurs, researchers, and professionals.

---

## Features

- **Conversational Data Collection**: Engage in a voice call where CoCo gathers detailed information about your business or industry of interest.
- **Multi-Agent Research**: A manager agent orchestrates a team of specialized agents to conduct in-depth research tailored to your input.
- **Detailed Presentations**: Receive a polished presentation with factual data, resources, and insights generated from the research.
- **Natural Language PPT Editor**: Edit and customize your presentation using simple, natural language commands.
- **Real-Time Collaboration**: Modify slides dynamically with an intuitive cursor-based UI.

---

## Tech Stack

### Frontend
- **[Vite](https://vitejs.dev/)**: Lightning-fast build tool for modern web development.
- **[TypeScript](https://www.typescriptlang.org/)**: Typed JavaScript for scalable and maintainable code.
- **[React](https://react.dev/)**: Component-based library for building interactive UIs.
- **[shadcn-ui](https://ui.shadcn.com/)**: Beautifully designed, accessible UI components.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid styling.
- **[Lovable](https://lovable.dev/)**: Enhancing the frontend with delightful developer experience.

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)**: High-performance Python framework for building APIs.
- **[smolagents](https://github.com/smol-ai/agents)**: Multi-agent framework including `CodeAgents`, `DuckDuckGoSearchTool`, and `ToolCallingAgent`.
- **[GPT-4o-mini](https://openai.com/)**: Lightweight, powerful AI model for natural language processing.
- **[Ngrok](https://ngrok.com/)**: Secure tunneling to expose local servers to the internet.
- **[Reveal.js](https://revealjs.com/)**: Framework for creating interactive presentations.
- **[ElevenLabs](https://elevenlabs.io/)**: Conversational AI powered by Gemini 1.5 Flash for realistic voice interactions.

---

## How It Works

1. **Start a Call**: Interact with CoCo via voice, providing details about the business or industry you’re interested in.
2. **Data Hand-off**: The conversation data is passed to a manager agent overseeing a team of `CodeAgents`.
3. **Deep Research**: The agents scour resources, analyze data, and compile a detailed plan.
4. **Presentation Delivery**: CoCo generates a Reveal.js-based presentation with actionable insights and references.
5. **Customize**: Use natural language commands to edit slides, tweak content, or adjust styling in real time.

---

## Installation and setup for the front-end:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rameshsam02/CoCo
   cd coco
   ```

2. **Install Requirements**
   - Install all dependencies listed in the `package.json` file:
     ```bash
     npm install
     ```

3. **Configure Environment**
   - Update the `.env` file to include the URL to the DeepSearch agent:
     ```
     VITE_API_URL=INSERT_LINK_HERE
     ```

4. **Run the Project**
   ```bash
   npm run dev
   ```

Checkout the backend repo and instructions here: https://github.com/dotvignesh/researchAgentAPI
