# Software Design Specification (SDS) - ViFinance News Frontend

**Version:** 1.0.0  
**Date:** May 24, 2025  
**Project:** ViFinance News Web Application Frontend  
**Course:** CS3332  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Component Design](#3-component-design)
4. [State Management](#4-state-management)
5. [User Interface Design](#5-user-interface-design)
6. [API Integration](#6-api-integration)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Routing & Navigation](#8-routing--navigation)
9. [Theme & Styling](#9-theme--styling)
10. [Error Handling](#10-error-handling)
11. [Performance Considerations](#11-performance-considerations)
12. [Security Considerations](#12-security-considerations)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment](#14-deployment)
15. [Future Enhancements](#15-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose
This Software Design Specification (SDS) describes the frontend architecture and implementation details for the ViFinance News web application. The frontend serves as the user interface layer for a comprehensive news analysis platform focused on Vietnamese financial news.

### 1.2 Scope
The frontend application provides:
- News article search and display functionality
- Advanced article analysis tools (sentiment, bias, fact-checking, toxicity analysis)
- User authentication and profile management
- Article synthesis and summarization capabilities
- Dark/light theme support
- Responsive design for multiple screen sizes

### 1.3 Technologies Used
- **Framework:** React 19.0.0 with functional components and hooks
- **Build Tool:** Vite 6.2.0
- **Styling:** Tailwind CSS 4.1.3 with custom theme system
- **Routing:** React Router DOM 7.5.1
- **Icons:** Lucide React and React Icons
- **Language:** JavaScript (ES6+)
- **Development Environment:** Node.js 20.18.0

### 1.4 System Overview
The frontend is a single-page application (SPA) that communicates with multiple backend services through RESTful APIs. It provides an intuitive interface for users to search, analyze, and interact with Vietnamese financial news articles.

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   UI Layer  │  │ State Mgmt  │  │    Routing Layer    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │              API Integration Layer                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│ AuthService       │ UserService    │ SearchService          │  
│ :6999             │ :6998          │ :7001                  │
│                   │                │                        │
│ SummariserService │ LoggingService | AnalysisService        │
│ :7002             │ :7000          | :7003                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Hierarchy

```
App
├── MainLayout
│   ├── TopNavBar
│   ├── HiddenSideNavBar
│   └── Outlet (Dynamic Content)
│       ├── MainHeader (Homepage)
│       ├── AuthTabs (Login/Register)
│       ├── RelevantArticles (Search Results)
│       ├── AnalysisPage (Article Analysis)
│       ├── UserProfilePage
│       ├── ProfileEditor
│       ├── SavedArticles
│       ├── SettingsPage
│       └── AboutUs
└── LoadingLayout (Fallback)
```

### 2.3 Data Flow Architecture

1. **User Interaction** → Component Event Handlers
2. **API Calls** → Backend Services via Fetch API
3. **State Updates** → Context API (Authentication) + Local State (Components)
4. **UI Re-render** → React's Virtual DOM reconciliation
5. **Theme Changes** → CSS Custom Properties + Tailwind Classes

---

## 3. Component Design

### 3.1 Core Components

#### 3.1.1 App Component (`App.jsx`)
**Purpose:** Root application component managing routing and authentication state.

**Key Features:**
- Route configuration and protection
- OTP verification flow management
- Loading state handling
- Authentication-based navigation guards

**Dependencies:**
- `useAuth` hook for authentication context
- React Router for navigation
- Various page components

#### 3.1.2 MainLayout (`layouts/MainLayout.jsx`)
**Purpose:** Primary layout wrapper providing consistent navigation structure.

**Key Features:**
- Top navigation bar integration
- Hidden sidebar navigation
- Dark mode toggle functionality
- Responsive design considerations

#### 3.1.3 AuthTabs (`components/AuthTabs.jsx`)
**Purpose:** Authentication interface handling login, registration, and password recovery.

**Key Features:**
- Tabbed interface for different auth modes
- OTP verification integration
- Google OAuth support
- Form validation and error handling
- Session management

**State Management:**
```javascript
const [activeTab, setActiveTab] = useState("login");
const [forgotPassword, setForgotPassword] = useState(false);
const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");
```

#### 3.1.4 RelevantArticles (`components/RelevantArticles.jsx`)
**Purpose:** Main article display and interaction component.

**Key Features:**
- Article search and display
- Voting system (upvote/downvote)
- Article saving functionality
- Synthesis generation from multiple articles
- Citation handling with reference links
- Analysis page navigation

**Complex State Management:**
```javascript
const [articles, setArticles] = useState([]);
const [synthLoading, setSynthLoading] = useState(false);
const [synthesis, setSynthesis] = useState("");
const [synthReferences, setSynthReferences] = useState(null);
const [savingMap, setSavingMap] = useState({}); // Per-article saving states
const [voteMap, setVoteMap] = useState({}); // Per-article voting states
```

#### 3.1.5 AnalysisPage (`components/AnalysisPage.jsx`)
**Purpose:** Comprehensive article analysis dashboard.

**Key Features:**
- Multiple analysis types: sentiment, toxicity, fact-checking, bias detection
- Sequential API calls with loading states
- Reference citation linking
- Analysis result visualization
- Article metadata display

**Analysis Types:**
1. **Fact-checking:** Verification of article claims with citations
2. **Sentiment Analysis:** Emotional tone detection
3. **Toxicity Analysis:** Harmful content detection
4. **Bias Detection:** Political or ideological bias assessment
5. **Article Summarization:** Content condensation

### 3.2 Navigation Components

#### 3.2.1 TopNavBar (`components/TopNavBar.jsx`)
**Features:**
- Search functionality integration
- User authentication status display
- Responsive menu toggle
- Theme-aware styling

#### 3.2.2 HiddenSideNavBar (`components/HIddenSideNavBar.jsx`)
**Features:**
- Collapsible sidebar navigation
- User profile quick access
- Dark mode toggle
- Logout functionality
- Responsive behavior

### 3.3 User Management Components

#### 3.3.1 UserProfilePage (`components/UserProfilePage.jsx`)
**Features:**
- Tabbed interface for different profile sections
- Financial data visualization placeholders
- Profile statistics display
- Navigation to profile editing

#### 3.3.2 ProfileEditor (`components/ProfileEditor.jsx`)
**Features:**
- User information editing
- Avatar upload functionality
- Password change capability
- Account deletion with confirmation
- Form validation and error handling

#### 3.3.3 SavedArticles (`components/SavedArticles.jsx`)
**Features:**
- Paginated article list display
- Article metadata presentation
- External link navigation
- Loading and error states

---

## 4. State Management

### 4.1 Context API Usage

#### 4.1.1 AuthContext (`authContext.jsx`)
**Purpose:** Global authentication state management.

**Provided Values:**
```javascript
{
  user: {
    userId: string,
    userName: string,
    email: string,
    bio: string,
    avatarLink: string
  },
  login: (userIdOrData) => Promise<void>,
  logout: () => void,
  loading: boolean,
  updateUser: (fields) => void
}
```

**Key Responsibilities:**
- Session validation on app initialization
- User profile data fetching and caching
- Login/logout state synchronization
- Cross-component user data sharing

### 4.2 Local State Patterns

#### 4.2.1 Loading States
Components implement consistent loading state patterns:
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
```

#### 4.2.2 Form State Management
Form components use controlled components pattern:
```javascript
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});
```

#### 4.2.3 Complex State Objects
For components with multiple interactive elements:
```javascript
const [itemMap, setItemMap] = useState({});
// Structure: { [itemId]: { loading: boolean, data: any, error: string } }
```

### 4.3 Custom Hooks

#### 4.3.1 useArticleSearch (`hooks/useArticleSearch.js`)
**Purpose:** Encapsulates article search logic and navigation.

```javascript
const { search, setSearch, handleSearch } = useArticleSearch(initial);
```

#### 4.3.2 useDarkMode (`hooks/useDarkMode.js`)
**Purpose:** Theme management with localStorage persistence.

```javascript
const { darkMode, toggleDarkMode } = useDarkMode();
```

#### 4.3.3 useTheme (`hooks/useTheme.js`)
**Purpose:** Alternative theme management implementation.

```javascript
const [theme, toggleTheme] = useTheme();
```

---

## 5. User Interface Design

### 5.1 Design Principles

#### 5.1.1 Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Breakpoint strategy:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible layouts** using CSS Grid and Flexbox
- **Touch-friendly interfaces** for mobile devices

#### 5.1.2 Accessibility
- **Semantic HTML** structure
- **ARIA labels** for interactive elements
- **Keyboard navigation** support
- **Color contrast** compliance
- **Screen reader** compatibility

#### 5.1.3 Visual Hierarchy
- **Typography scale** using system fonts and Poppins
- **Color system** with primary lime green theme
- **Spacing consistency** using Tailwind spacing scale
- **Visual feedback** for interactive elements

### 5.2 Component Styling Approach

#### 5.2.1 Tailwind CSS Utility Classes
Primary styling method using atomic CSS classes:
```jsx
<div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
```

#### 5.2.2 Custom CSS Properties
Theme variables defined in `customTheme.css`:
```css
--color-primary-a0: #14c400;
--color-surface-a0: #ffffff;
--color-dark-surface-a0: #121212;
```

#### 5.2.3 Component-Specific Styles
Custom classes for specific behaviors:
```css
.hidden-bar {
  background-color: var(--color-primary-a0);
  @variant dark {
    background-color: var(--color-dark-primary-a0);
  }
}
```

### 5.3 Animation and Transitions

#### 5.3.1 Micro-interactions
- **Hover effects** on buttons and cards
- **Loading spinners** for async operations
- **Fade transitions** for content changes
- **Transform animations** for interactive elements

#### 5.3.2 Page Transitions
- **Smooth navigation** between routes
- **Loading states** during data fetching
- **Error state animations** for user feedback

---

## 6. API Integration

### 6.1 Configuration System

#### 6.1.1 API Base URLs (`config.js`)
Centralized configuration for all backend services:
```javascript
export const API_BASES = {
  auth: "http://localhost:8080",
  user: "http://localhost:6998", 
  search: "http://localhost:7001",
  analysis: "http://localhost:7003",
  summariser: "http://localhost:7002",
  logging: "http://localhost:7000"
};
```

### 6.2 Service Integration Patterns

#### 6.2.1 Search Service Integration
**Endpoints Used:**
- `POST /api/get_cached_result` - Article search
- `POST /api/save` - Save articles to user account
- `POST /api/get_up_vote` / `POST /api/get_down_vote` - Voting system
- `POST /api/get_user_vote` - Retrieve user's vote status
- `POST /api/get_total_upvotes` - Get article popularity

**Implementation Pattern:**
```javascript
const response = await fetch(`${API_BASES.search}/api/get_cached_result`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // For session cookies
  body: JSON.stringify({ query })
});
```

#### 6.2.2 Analysis Service Integration
**Sequential Analysis Pattern:**
The AnalysisPage implements a sophisticated sequential analysis system:

1. **Fact-checking** → 15s delay
2. **Summary generation** → 15s delay  
3. **Sentiment analysis** → 15s delay
4. **Toxicity analysis** → 15s delay
5. **Bias detection**

**Error Handling:**
- 404 responses handled gracefully
- Network errors with retry logic
- Progressive enhancement (partial results displayed)

#### 6.2.3 User Service Integration
**Profile Management:**
- User profile data fetching
- Avatar upload with file handling
- Saved articles with pagination
- Account management operations

#### 6.2.4 Authentication Service Integration
**Security Features:**
- Session-based authentication
- OTP verification flow
- Google OAuth integration
- Secure logout with session cleanup

### 6.3 Data Flow Patterns

#### 6.3.1 Optimistic Updates
For user interactions like voting:
```javascript
// Immediate UI update
setVoteMap(prev => ({...prev, [url]: {loading: true}}));

// API call
const response = await fetch(endpoint, options);

// Confirm or rollback
if (response.ok) {
  setVoteMap(prev => ({...prev, [url]: {vote: newVote}}));
} else {
  setVoteMap(prev => ({...prev, [url]: {error: 'Failed'}}));
}
```

#### 6.3.2 Batch Operations
For efficiency, some operations are batched:
- Multiple article vote status checks
- Parallel API calls for article analysis
- Bulk article saving operations

---

## 7. Authentication & Authorization

### 7.1 Authentication Flow

#### 7.1.1 Two-Step Authentication Process
1. **Email/Password Verification:** 
   - `POST /api/verify` validates credentials
   - Server sends OTP via email
   
2. **OTP Confirmation:**
   - `POST /api/login` with OTP completes authentication
   - Session cookie established

#### 7.1.2 Session Management
- **Session Persistence:** HTTP-only cookies for security
- **Auto-login:** Session validation on app initialization
- **Session Refresh:** Handled transparently by backend

#### 7.1.3 OAuth Integration
- **Google OAuth:** Alternative authentication method
- **Token Exchange:** Google ID token exchanged for session
- **Fallback Handling:** Graceful degradation if OAuth unavailable

### 7.2 Authorization Patterns

#### 7.2.1 Route Protection
```javascript
<Route 
  path="/profile" 
  element={user ? <UserProfilePage /> : <Navigate to="/" />} 
/>
```

#### 7.2.2 Feature Gating
```javascript
{user ? (
  <SavedArticlesButton />
) : (
  <LoginPrompt />
)}
```

#### 7.2.3 API Authorization
All API calls include session credentials:
```javascript
fetch(url, {
  credentials: "include",
  // ... other options
})
```

### 7.3 Security Considerations

#### 7.3.1 XSS Prevention
- **Input Sanitization:** All user inputs validated
- **dangerouslySetInnerHTML:** Used only for trusted content (API responses)
- **CSP Headers:** Content Security Policy (backend implementation)

#### 7.3.2 CSRF Protection
- **SameSite Cookies:** Backend cookie configuration
- **Origin Validation:** CORS policy enforcement
- **Session Validation:** Server-side session verification

---

## 8. Routing & Navigation

### 8.1 Route Configuration

#### 8.1.1 Public Routes
- `/` - Homepage (MainHeader)
- `/login` - Authentication interface
- `/about-us` - Information page
- `/relevant-articles` - Public article search

#### 8.1.2 Protected Routes
- `/profile` - User profile dashboard
- `/profile-edit` - Profile editing interface
- `/analysis` - Article analysis page
- `/settings` - User preferences
- `/saved-articles` - User's saved articles

#### 8.1.3 Route Structure
```javascript
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<MainHeader />} />
    <Route path="/login" element={<AuthComponent />} />
    {/* ... other routes */}
  </Route>
</Routes>
```

### 8.2 Navigation Patterns

#### 8.2.1 Programmatic Navigation
Using React Router's `useNavigate` hook:
```javascript
const navigate = useNavigate();

const handleAnalyze = (article) => {
  navigate("/analysis", {
    state: { article }
  });
};
```

#### 8.2.2 Navigation Guards
Authentication-based route protection:
```javascript
element={user ? <ProtectedComponent /> : <Navigate to="/login" />}
```

#### 8.2.3 State Transfer
Passing data between routes using location state:
```javascript
// Sender
navigate("/analysis", { state: { article } });

// Receiver
const { article } = location.state || {};
```

### 8.3 URL Management

#### 8.3.1 Query Parameters
Search functionality uses URL query parameters:
```javascript
const query = useQuery().get("query") || "";
navigate(`/relevant-articles?query=${encodeURIComponent(searchTerm)}`);
```

#### 8.3.2 Deep Linking
All routes support direct URL access and browser refresh.

---

## 9. Theme & Styling

### 9.1 Design System

#### 9.1.1 Color Palette
**Primary Colors (Lime Green Theme):**
```css
--color-primary-a0: #14c400;    /* Primary green */
--color-primary-a10: #4acb35;   /* Lighter variant */
--color-primary-a20: #69d253;   /* Even lighter */
/* ... gradient continues */
```

**Surface Colors:**
```css
/* Light mode */
--color-surface-a0: #ffffff;
--color-surface-a10: #f0f0f0;

/* Dark mode */
--color-dark-surface-a0: #121212;
--color-dark-surface-a10: #282828;
```

#### 9.1.2 Typography
- **Primary Font:** Poppins (loaded from local file)
- **Fallback:** System font stack
- **Font Loading:** `@font-face` with TTF format

#### 9.1.3 Spacing System
Tailwind CSS spacing scale (0.25rem increments):
- Margins: `m-1` (0.25rem) to `m-96` (24rem)
- Padding: `p-1` to `p-96` 
- Gaps: `gap-1` to `gap-96`

### 9.2 Dark Mode Implementation

#### 9.2.1 Theme Detection
```javascript
const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});
```

#### 9.2.2 CSS Class Toggle
```javascript
useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);
```

#### 9.2.3 Tailwind Dark Mode Classes
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

### 9.3 Custom CSS System

#### 9.3.1 CSS Custom Properties
Theme variables accessible throughout the application:
```css
@theme {
  --color-primary-a0: #14c400;
  /* ... other variables */
}
```

#### 9.3.2 Tailwind Extensions
Custom variants for complex theming:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

#### 9.3.3 Component-Specific Styles
Dedicated CSS classes for complex components:
```css
.hidden-bar {
  background-color: var(--color-primary-a0);
  @variant dark {
    background-color: var(--color-dark-primary-a0);
  }
}
```

---

## 10. Error Handling

### 10.1 Error Handling Strategies

#### 10.1.1 API Error Handling
**Centralized Error Processing:**
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Request failed');
  }
  
  return data;
} catch (error) {
  setError(error.message);
  console.error('API Error:', error);
}
```

#### 10.1.2 Network Error Handling
- **Timeout handling** for slow connections
- **Retry logic** for transient failures
- **Fallback content** for offline scenarios
- **User-friendly error messages**

#### 10.1.3 Form Validation Errors
```javascript
const [errors, setErrors] = useState({});

const validateForm = (formData) => {
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Email is required';
  if (!formData.password) newErrors.password = 'Password is required';
  return newErrors;
};
```

### 10.2 Error Display Patterns

#### 10.2.1 Inline Error Messages
```jsx
{error && (
  <div className="text-red-500 text-sm mt-1">
    {error}
  </div>
)}
```

#### 10.2.2 Toast Notifications
Temporary error messages that auto-dismiss:
```javascript
setTimeout(() => setError(''), 3000);
```

#### 10.2.3 Fallback UI Components
```jsx
{loading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} onRetry={handleRetry} />
) : (
  <MainContent data={data} />
)}
```

### 10.3 Error Recovery

#### 10.3.1 Graceful Degradation
- **Partial data display** when some API calls fail
- **Feature fallbacks** when services are unavailable
- **Progressive enhancement** based on available data

#### 10.3.2 User-Initiated Recovery
- **Retry buttons** for failed operations
- **Refresh functionality** for stale data
- **Alternative pathways** when primary features fail

---

## 11. Performance Considerations

### 11.1 Optimization Strategies

#### 11.1.1 Code Splitting
Vite's automatic code splitting for route-based chunks:
```javascript
// Automatic route-based splitting
const AnalysisPage = lazy(() => import('./components/AnalysisPage'));
```

#### 11.1.2 Image Optimization
- **Lazy loading** for article images
- **Fallback images** for broken links
- **Responsive image sizing**

#### 11.1.3 API Optimization
- **Request deduplication** for identical calls
- **Caching strategies** for frequently accessed data
- **Batch API calls** where possible

### 11.2 Memory Management

#### 11.2.1 Effect Cleanup
```javascript
useEffect(() => {
  const timer = setTimeout(() => setError(''), 3000);
  return () => clearTimeout(timer);
}, []);
```

#### 11.2.2 Event Listener Management
Proper cleanup for event listeners and subscriptions.

#### 11.2.3 State Optimization
- **Minimal state updates** to reduce re-renders
- **State normalization** for complex data structures
- **Memoization** for expensive computations

### 11.3 Bundle Optimization

#### 11.3.1 Vite Configuration
Optimized build configuration for production:
- **Tree shaking** for unused code elimination
- **Minification** for smaller bundle sizes
- **Asset optimization** for static resources

#### 11.3.2 Dependency Management
- **Selective imports** from large libraries
- **Bundle analysis** to identify optimization opportunities
- **Vendor chunk optimization**

---

## 12. Security Considerations

### 12.1 Client-Side Security

#### 12.1.1 Input Validation
- **Client-side validation** for user experience
- **Server-side validation** for security (backend responsibility)
- **XSS prevention** through proper escaping

#### 12.1.2 Sensitive Data Handling
- **No sensitive data in localStorage**
- **Session tokens in HTTP-only cookies**
- **Minimal client-side data exposure**

#### 12.1.3 Content Security
- **Sanitized HTML rendering** for user-generated content
- **Trusted source verification** for external links
- **Safe navigation** for external resources

### 12.2 Communication Security

#### 12.2.1 HTTPS Enforcement
Production deployment requires HTTPS for:
- **Secure cookie transmission**
- **API communication encryption**
- **User data protection**

#### 12.2.2 CORS Configuration
Proper CORS setup for cross-origin requests:
- **Restricted origins** in production
- **Credential inclusion** for authenticated requests
- **Method and header restrictions**

### 12.3 Authentication Security

#### 12.3.1 Session Management
- **Session timeout** handling
- **Concurrent session** management
- **Secure logout** with token invalidation

#### 12.3.2 OAuth Security
- **State parameter** for CSRF protection
- **Token validation** on the server side
- **Scope limitation** for minimal permissions

---

## 13. Testing Strategy

### 13.1 Testing Approach

#### 13.1.1 Unit Testing
- **Component testing** with React Testing Library
- **Hook testing** for custom hooks
- **Utility function testing**

#### 13.1.2 Integration Testing
- **API integration** testing
- **User flow** testing
- **Authentication flow** testing

#### 13.1.3 End-to-End Testing
- **Critical user journeys**
- **Cross-browser compatibility**
- **Responsive design validation**

### 13.2 Testing Tools

#### 13.2.1 Recommended Stack
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **Cypress** - End-to-end testing

#### 13.2.2 Test Organization
```
src/
├── components/
│   ├── Component.jsx
│   └── Component.test.jsx
├── hooks/
│   ├── useHook.js
│   └── useHook.test.js
└── __tests__/
    └── integration/
```

### 13.3 Testing Scenarios

#### 13.3.1 Authentication Testing
- Login/logout flows
- Session persistence
- Route protection
- Error handling

#### 13.3.2 Feature Testing
- Article search and display
- Voting functionality
- Synthesis generation
- Analysis page interactions

---

## 14. Deployment

### 14.1 Build Process

#### 14.1.1 Production Build
```bash
npm run build
```

#### 14.1.2 Build Output
- **Static assets** in `dist/` directory
- **Optimized JavaScript** bundles
- **CSS** with vendor prefixes
- **Asset fingerprinting** for cache busting

### 14.2 Deployment Targets

#### 14.2.1 Static Hosting
- **Netlify** - Recommended for simplicity
- **Vercel** - Alternative with good React support
- **GitHub Pages** - For open-source projects

#### 14.2.2 CDN Integration
- **Asset delivery** optimization
- **Geographic distribution**
- **Caching strategies**

### 14.3 Environment Configuration

#### 14.3.1 Environment Variables
```javascript
// .env.production
VITE_API_BASE_URL=https://api.vifinancenews.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

#### 14.3.2 Build-time Configuration
Different configurations for development, staging, and production environments.

---

## 15. Future Enhancements

### 15.1 Planned Features

#### 15.1.1 Performance Enhancements
- **Service Worker** implementation for offline support
- **Progressive Web App** features
- **Advanced caching** strategies
- **Image optimization** with modern formats

#### 15.1.2 User Experience Improvements
- **Advanced search filters**
- **Personalized recommendations**
- **Reading history** tracking
- **Social sharing** features

#### 15.1.3 Technical Improvements
- **TypeScript** migration for better type safety
- **GraphQL** integration for more efficient data fetching
- **State management** upgrade (Redux Toolkit or Zustand)
- **Testing** coverage improvements

### 15.2 Scalability Considerations

#### 15.2.1 Architecture Evolution
- **Micro-frontend** architecture for large teams
- **Component library** extraction for reusability
- **API abstraction** layer for better maintainability

#### 15.2.2 Performance Scaling
- **Virtual scrolling** for large article lists
- **Infinite scroll** implementation
- **Real-time updates** with WebSocket integration
- **Advanced analytics** integration

### 15.3 Technology Upgrades

#### 15.3.1 Framework Updates
- **React 19** feature adoption (Suspense, Concurrent Features)
- **Next.js** migration for SSR benefits
- **Tailwind CSS** v4 full feature utilization

#### 15.3.2 Development Experience
- **ESLint** and **Prettier** configuration
- **Husky** pre-commit hooks
- **GitHub Actions** CI/CD pipeline
- **Storybook** for component documentation

---

## Conclusion

This Software Design Specification provides a comprehensive overview of the ViFinance News frontend application architecture. The design emphasizes modularity, maintainability, and user experience while ensuring security and performance. The implementation follows modern React best practices and provides a solid foundation for future enhancements and scaling.

The architecture supports the application's core mission of providing Vietnamese users with powerful tools for financial news analysis, combining intuitive design with sophisticated analytical capabilities.

---

**Document Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | May 24, 2025 | Dung Nguyen | Initial comprehensive SDS creation |

---

**References:**
- React Documentation: https://react.dev/
- Tailwind CSS Documentation: https://tailwindcss.com/
- Vite Documentation: https://vitejs.dev/
- ViFinance News API Documentation (See API_DOC/ folder)
