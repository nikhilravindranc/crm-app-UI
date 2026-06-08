# CRM App UI

A modern, responsive Customer Relationship Management (CRM) application built with **Next.js** and **React**. Features a comprehensive dashboard with support for managing contacts, leads, accounts, deals, and reports.

## 🚀 Features

- **Dashboard**: Interactive overview of key metrics and statistics
- **Leads Management**: Create, view, and manage sales leads
- **Contacts**: Maintain a complete contact database
- **Accounts**: Manage corporate accounts and organizations
- **Deals**: Track sales opportunities and pipeline
- **Reports**: Visualize data with charts and analytics
- **Modern UI**: Built with Tailwind CSS and Material-UI components
- **Fully Typed**: TypeScript for type-safe development
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.0+
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Material-UI](https://mui.com/)
  - [Emotion](https://emotion.sh/)
- **UI Components**:
  - [@phosphor-icons/react](https://phosphoricons.com/)
  - [@mui/icons-material](https://mui.com/material-ui/icons/)
- **Charts**: [Recharts](https://recharts.org/)
- **React Version**: 19.0+

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nikhilsdl123-cmd/crm-app-ui.git
   cd crm-app-ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify installation**:
   ```bash
   npm list | head -20
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
crm-app-ui/
├── app/                      # Next.js app directory
│   ├── accounts/            # Accounts page & components
│   ├── contacts/            # Contacts page & components
│   ├── deals/               # Deals page & components
│   ├── leads/               # Leads page & components
│   ├── reports/             # Reports page & components
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard home page
├── components/              # Reusable components
│   ├── accounts/            # Account-related components
│   ├── contacts/            # Contact-related components
│   ├── dashboard/           # Dashboard widgets
│   ├── deals/               # Deal-related components
│   ├── layout/              # Layout components (Header, Sidebar, etc.)
│   ├── leads/               # Lead-related components
│   ├── ThemeRegistry.tsx    # Material-UI theme setup
├── lib/                     # Utility functions and helpers
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## 🎨 Key Components

### Layout
- **Header/Navigation**: Main navigation bar with branding
- **Sidebar**: Navigation menu for different sections
- **ThemeRegistry**: Material-UI theme configuration with custom styling

### Pages
- **Dashboard (/)**: Main overview page with metrics
- **Leads (/leads)**: Lead listing, creation, and detail views
- **Contacts (/contacts)**: Contact management interface
- **Accounts (/accounts)**: Account management interface
- **Deals (/deals)**: Deal pipeline and management
- **Reports (/reports)**: Analytics and reporting dashboard

## 🎯 Design Features

- **Modern Color Scheme**: Professional and visually appealing UI
- **Interactive Elements**: Smooth transitions and hover effects
- **Icons**: Comprehensive icon set for visual clarity
- **Charts & Graphs**: Data visualization with Recharts
- **Responsive Grid**: Flexible layout that adapts to screen sizes
- **Material Design**: Follows Material Design 3 principles

## 💻 Development Workflow

1. **Edit files** in your preferred IDE (VS Code recommended)
2. **Save changes** - Next.js will hot-reload automatically
3. **Test in browser** - Visit `http://localhost:3000`
4. **Build and test** - Run `npm run build` before committing

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Git Workflow

```bash
# Add changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main
```

## 🔒 Environment Variables

Create a `.env.local` file in the root directory for any environment-specific variables (if needed):

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material-UI Documentation](https://mui.com/material-ui/getting-started/)

## 👤 Author

**Nikhil SDL** - [@nikhilsdl123-cmd](https://github.com/nikhilsdl123-cmd)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/nikhilsdl123-cmd/crm-app-ui/issues).

---

**Last Updated**: June 8, 2026

For questions or support, please open an issue on GitHub.
