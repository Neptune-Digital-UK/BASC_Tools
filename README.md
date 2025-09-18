# BASC Tools - Insurance Agent Toolkit

A production-ready React application suite for insurance agents, starting with Bascule's Major Medical Sport Horse Edition insurance eligibility assessment.

## Features

### Current Tools
- **Sport Horse Eligibility Wizard**: Step-by-step eligibility assessment based on horse value, use, age, and coverage preferences
- **Real-time Validation**: Instant feedback on eligibility criteria
- **Responsive Design**: Optimized for desktop and mobile devices
- **Clean UI**: Modern, accessible interface with clear visual hierarchy
- **TypeScript**: Full type safety and better developer experience

### Platform Features
- **Multi-tool Architecture**: Easy to add new insurance tools
- **Consistent Navigation**: Unified experience across all tools
- **Scalable Design**: Built to accommodate future tools and features

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BASC_Tools
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage with tool navigation
│   └── tools/             # Individual tool pages
│       ├── layout.tsx     # Tools section layout
│       ├── sport-horse-eligibility/
│       │   └── page.tsx   # Sport Horse Eligibility Tool
│       └── template/
│           └── page.tsx   # Template for new tools
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx     # Button component
│   │   └── card.tsx       # Card component
│   ├── SportHorseEligibilityWizard.tsx  # Main wizard component
│   └── ToolNavigation.tsx # Navigation component for tools
└── lib/
    └── utils.ts           # Utility functions
```

## Eligibility Logic

The wizard implements Bascule's eligibility rules:

1. **Value Gate**: Horses under $20k are not eligible for Major Medical
2. **Use Categories**: Different disciplines have different coverage options
3. **Age Restrictions**: Horses over 20 years have limited Major Medical options
4. **Preference Matching**: Recommendations based on coverage preferences

## Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

Build the application:
```bash
npm run build
```

## Adding New Tools

To add a new tool to the platform:

1. **Create the tool page:**
   ```bash
   mkdir src/app/tools/your-new-tool
   cp src/app/tools/template/page.tsx src/app/tools/your-new-tool/page.tsx
   ```

2. **Update the tool page:**
   - Change the `toolName` prop in `ToolNavigation`
   - Replace the template content with your tool's functionality
   - Add any new components to the `components/` directory

3. **Add to homepage:**
   - Update `src/app/page.tsx` to include a new card for your tool
   - Add the appropriate icon and description
   - Link to `/tools/your-new-tool`

4. **Test and deploy:**
   - Run `npm run build` to ensure everything compiles
   - Test the new tool thoroughly
   - Deploy as usual

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test on both desktop and mobile
4. Ensure accessibility standards are met
5. Use the template for new tools

## License

Private - Bascule Insurance Tools
