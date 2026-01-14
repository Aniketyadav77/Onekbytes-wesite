# Onekbyte Company Website

A modern, responsive website for Onekbyte, a company focused on developing and deploying cutting-edge AI models and technologies. Built with Next.js, TypeScript, Tailwind CSS, and Supabase for authentication.

## Features

- **Modern Design**: Apple-inspired clean and minimal UI/UX
- **Authentication**: Complete user authentication system with Supabase
- **Responsive**: Mobile-first design that works on all devices
- **Navigation**: Sticky animated navigation bar
- **Pages**: Home, About, Research, Careers, Sign In, Sign Up
- **Protected Routes**: Authentication-based route protection
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd onekbyte-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database:
Create a `profiles` table in your Supabase database:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── careers/           # Careers page
│   ├── research/          # Research page
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation component
│   └── ProtectedRoute.tsx # Route protection component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utility functions
    └── supabase.ts        # Supabase client configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. Users can sign up with email, password, and full name
2. User profiles are automatically created in the Supabase database
3. Sign in with email and password
4. Session persistence across browser sessions
5. Protected routes redirect unauthenticated users to sign in

## Design Philosophy

The website follows Apple's design principles:
- Clean and minimal interface
- Subtle animations and transitions
- High contrast and readable typography
- Consistent spacing and layout
- Focus on user experience

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Onekbyte.

## Support

For support and questions, please contact the development team.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Add a PNG to MVP Page

- Place your image: put a `.png` file at `public/images/mvp-image.png`.
- Preview: visit `/mvp` — the image appears in the lower section.
- Effects: the image uses `animate-fade-in-up`, `animate-float-slow`, and `hover-tilt-lift` helpers from `src/app/globals.css`.
- Customize: replace the file, or tweak the classes in `src/app/mvp/page.tsx` for different motion.
