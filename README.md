# BASC Tools - Insurance Agent Toolkit

A production-ready React application suite for insurance agents, starting with Bascule's Major Medical Sport Horse Edition insurance eligibility assessment.

## Features

### Current Tools

#### 🤖 AI Eligibility Evaluator (NEW)
- **Form-Based Evaluation**: Simple form to collect horse details
- **AI-Powered Analysis**: Integrated with Chatbase AI API for intelligent eligibility evaluation
- **Instant Results**: Real-time evaluation with comprehensive coverage recommendations
- **Export Summaries**: One-click copy of formatted evaluation summaries
- **Visual Results Display**: Color-coded status indicators and coverage breakdowns

#### 📋 Eligibility Response Parser
- **JSON Parser**: Paste AI-generated JSON responses for formatted viewing
- **Professional Display**: Clean, organized presentation of eligibility data
- **Coverage Breakdown**: Visual display of all eligible coverages with details
- **Quick Actions**: Copy summaries, print results, export data

#### 🏇 Medical Coverage Eligibility Wizard
- **Step-by-Step Assessment**: Interactive wizard for eligibility assessment
- **Sport & Western Categories**: Coverage for both horse categories
- **Real-time Validation**: Instant feedback on eligibility criteria
- **Preference Matching**: AI recommendations based on coverage preferences

#### 🛡️ Equine Risk Selector
- **Appetite Guidelines**: Quick reference for risk appetite by breed/use
- **Search & Filter**: Find eligibility rules instantly
- **Category-Based**: Organized by Western, Sport Horse, Breed-Specific, and more
- **UW Contact**: Direct links to underwriting for questions

### Platform Features
- **Multi-tool Architecture**: Easy to add new insurance tools
- **Consistent Navigation**: Unified experience across all tools
- **Scalable Design**: Built to accommodate future tools and features
- **Responsive Design**: Optimized for desktop and mobile devices
- **TypeScript**: Full type safety and better developer experience

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
│       ├── eligibility-evaluator/
│       │   └── page.tsx   # AI Eligibility Evaluator (NEW)
│       ├── eligibility-parser/
│       │   └── page.tsx   # Eligibility Response Parser
│       ├── equine-risk-selector/
│       │   └── page.tsx   # Equine Risk Selector
│       ├── sport-horse-eligibility/
│       │   └── page.tsx   # Medical Coverage Eligibility Wizard
│       └── template/
│           └── page.tsx   # Template for new tools
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx     # Button component
│   │   ├── card.tsx       # Card component
│   │   └── input.tsx      # Input component
│   ├── EquineRiskSelector.tsx           # Risk appetite component
│   ├── SportHorseEligibilityWizard.tsx  # Eligibility wizard component
│   └── ToolNavigation.tsx               # Navigation component for tools
└── lib/
    └── utils.ts           # Utility functions
```

## Eligibility Logic

The tools implement Bascule's comprehensive eligibility rules:

### Risk Appetite Rules
- **Western Uses**: Cutting, Reining, Barrel Racing, Roping, Ranch, etc.
- **Sport Horse Uses**: Hunters, Jumpers, Dressage, Eventing, Polo, etc.
- **Breed-Specific**: Eligibility by breed (Thoroughbred, Arabian, Morgan, etc.)
- **Special Cases**: Draft horses, Quarter Horse racing, breeding considerations

### Coverage Eligibility Rules
1. **Value Gates**: 
   - Under $20k: Major Medical not available (Medical Assistance still eligible)
   - $20k-$99k: Major Medical available with coinsurance
   - $100k+: Classic Major Medical without coinsurance

2. **Use Categories**: Different disciplines have different coverage options:
   - Sport Eventing: Limited to External Accident MM & Surgical
   - Sport Dressage: Value-dependent eligibility
   - Western Barrel: Limited to External Accident MM, Basic MM ($7,500 limit), Surgical
   - General categories: Full coverage suite available

3. **Age Restrictions**: 
   - 31 days - 20 years: Standard eligibility
   - Ponies over 20 years: Limited options (no Medical Assistance, Surgical, Colic, or Classic)

4. **AI-Powered Recommendations**: Context-aware suggestions based on all factors

## AI Integration

The AI Eligibility Evaluator integrates with Chatbase API:

- **Endpoint**: `https://www.chatbase.co/api/v1/chat`
- **Authentication**: Bearer token
- **Input Format**: Structured JSON with horse details
- **Output Format**: Comprehensive eligibility evaluation with recommendations

See `ELIGIBILITY_AI_AGENT.md` for complete system message and integration details.
See `AI_EVALUATOR_GUIDE.md` for user guide and troubleshooting.

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
