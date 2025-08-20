# Security Vulnerability Kanban Board

A modern, responsive kanban board application for managing security vulnerabilities, built with Next.js, TypeScript, and Redux Toolkit.

## Features

### 🔐 User Authentication
- **Sign up/Login**: Secure user authentication with form validation
- **Session Management**: Persistent login state using Redux
- **Protected Routes**: Access control to prevent unauthorized access
- **Password Validation**: Secure password requirements with visibility toggle

### 📋 Kanban Board
- **Drag & Drop**: Intuitive task movement between columns using @dnd-kit
- **5 Columns**: Draft, Unsolved, Under Review, Solved, and New
- **Real-time Updates**: Instant state updates with Redux Toolkit
- **Visual Feedback**: Smooth animations and hover effects

### 🏷️ Task Management
- **Rich Task Cards**: ID, title, severity scores, creation dates
- **Label System**: Multiple label types (severity, category, source)
- **Color Coding**: Visual severity indicators (Critical, Medium, Low)
- **Task Metadata**: Comprehensive task information tracking

### 🔍 Advanced Filtering
- **Search**: Real-time task search by title
- **Label Filtering**: Multi-select label filters with visual indicators
- **Sorting**: Sort by date, severity, or title (ascending/descending)
- **Active Filters**: Clear visual representation of applied filters

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile drag-and-drop support
- **Adaptive Layout**: Grid system that responds to viewport changes
- **Professional UI**: Clean, modern interface following design best practices

### ⚡ Performance & Architecture
- **Redux Toolkit**: Efficient state management with RTK
- **TypeScript**: Full type safety throughout the application
- **Modular Components**: Clean, reusable component architecture
- **Optimized Rendering**: Efficient re-renders with proper memoization

## Technology Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Drag & Drop**: @dnd-kit
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd security-kanban-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Authentication
1. **Sign Up**: Create a new account with email, password, and full name
2. **Login**: Access your dashboard with existing credentials
3. **Logout**: Secure session termination

### Managing Vulnerabilities
1. **View Tasks**: Browse vulnerabilities organized by status columns
2. **Drag & Drop**: Move tasks between columns to update status
3. **Search**: Use the search bar to find specific vulnerabilities
4. **Filter**: Apply label filters to focus on specific types
5. **Sort**: Organize tasks by date, severity, or title

### Task Information
- **ID**: Unique identifier for each vulnerability
- **Title**: Descriptive vulnerability name
- **Severity**: Numerical score (0-10) with color coding
- **Labels**: Categorization tags (Critical, Medium, Low, etc.)
- **Date**: Creation timestamp

## Architecture Decisions

### State Management
- **Redux Toolkit**: Chosen for predictable state updates and excellent DevTools
- **Slices**: Separate slices for auth and kanban functionality
- **Async Actions**: Simulated API calls with proper loading states

### Drag & Drop
- **@dnd-kit**: Selected for accessibility, touch support, and flexibility
- **Custom Sensors**: Configured for optimal drag experience
- **Collision Detection**: Proper drop zone detection and visual feedback

### Component Architecture
- **Feature-Based**: Components organized by functionality
- **Reusability**: Shared UI components with consistent props
- **Type Safety**: Full TypeScript integration throughout

### Performance Optimizations
- **Selective Filtering**: Client-side filtering for immediate feedback
- **Efficient Sorting**: Optimized sort algorithms
- **Memoization**: Strategic use of React optimization techniques

## Security Considerations

- **Input Validation**: Zod schemas for form validation
- **XSS Protection**: Proper data sanitization
- **Authentication**: Secure session management patterns
- **Data Integrity**: Immutable state updates with Redux Toolkit

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from the Dribbble community
- shadcn/ui for the excellent component library
- The React and Next.js communities for outstanding tooling