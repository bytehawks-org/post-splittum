✂️ PostSplittum

PostSplittum is a high-performance visual thread generator designed for Bluesky and platforms with strict character limits. It is engineered to transform a long, monolithic Scriptum into a series of perfectly coherent Splittum (posts), ensuring semantic integrity through a punctuation-aware splitting engine.
🚀 The Splitting Philosophy

Unlike basic text cutters, PostSplittum respects the flow of your writing:

    Intelligent Scriptum Analysis: Prioritizes natural sentence endings (., !, ?).

    Punctuation-Aware Ellipses: If a break occurs after a comma, semicolon, or colon, the script automatically applies a leading space to the ellipsis ( , ...) for superior readability, as per user-defined typographic rules.

    Non-Blocking Engine: Powered by React's useTransition, the splitting logic runs in the background. Your typing remains fluid, no matter how long the original Scriptum is.

🛠 Features

    Editable Balloon UI: Every generated post is rendered as a standalone "balloon". You can edit the final posts individually to add that last bit of polish without touching the source text.

    Live Split-Screen Layout: A professional dashboard featuring a sticky control panel on the left and a scrollable thread preview on the right (automatically stacks on mobile).

    Dynamic Metadata:

        Post Identifiers: Toggle between x/y, (x/y), or [x/y] formats.

        Custom Positioning: Place counters at the start or end of each post.

        Visual Flow Emojis: Automatically appends ⬇️ for intermediate posts and ⏹️ for the thread finale.

    Real-time Character Tracking: Each balloon features an independent counter that turns red if manual edits exceed the character limit.

💻 Tech Stack

    Framework: React 19 + Vite

    Styling: Tailwind CSS v4 (Utilizing the new CSS-first architecture)

    Icons: Lucide-react

    CI/CD: Automated GitHub Actions workflow for deployment to gh-pages

    Custom Domain: Optimized for bsplitter.bytehawks.org

📦 Getting Started
Bash

# Clone the repository
git clone https://github.com/tuo-username/post-splittum.git

# Install dependencies
npm install

# Launch development server
npm run dev

# Build for production
npm run build

GitHub "About" Section (sidebar):

    ✂️ Turn long Scriptum into perfect Splittum. A high-performance Bluesky threader featuring punctuation-aware splitting, editable balloons, and a non-blocking React 19 engine.

