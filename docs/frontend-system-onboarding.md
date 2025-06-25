# Context

### 1️⃣ **components/**
Reusable UI components:
- will get added later on.

### 2️⃣ **pages/**
Full page components that compose smaller components:
- App.jsx: Default homepage

### 3️⃣ **services/**
API communication layer:
- will get added.
### 4️⃣ **hooks/**
Custom React hooks:
- will get added later.

### 5️⃣ **context/**
React Context providers:
- will get added.

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.0 | UI Library |
| react-dom | 19.1.0 | DOM rendering |
| @types/react | 19.1.8 | TypeScript definitions |
| @types/react-dom | 19.1.6 | TypeScript definitions |
| vite | 7.0.0 | Build tool |
| eslint | 9.29.0 | Code linting |
| @vitejs/plugin-react-swc | 3.10.2 | React plugin for Vite |

## Development Tools

### ESLint Configuration
The project uses ESLint with several plugins:
- eslint-plugin-react-hooks: 5.2.0
- eslint-plugin-react-refresh: 0.4.20
- @eslint/js: 9.29.0

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## API Integration

The frontend communicates with the Spring Boot backend running on `http://localhost:8080`. Main API endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/api/v1/vehicle/all` | Get all vehicles |
| `/api/v1/vehicle/{id}` | Get vehicle by ID |
| `/api/v1/auth/login` | User authentication |
| `/api/v1/auth/register` | User registration |

## Development Workflow

1. **Component Development**
    - Create components in appropriate directories
    - Use TypeScript for type safety
    - Follow React hooks guidelines

2. **State Management**
    - Use React Context for global state
    - Local state with useState/useReducer
    - Custom hooks for reusable logic

3. **API Integration**
    - Service layer abstracts API calls
    - Use TypeScript interfaces for API responses
    - Handle loading and error states

4. **Testing**
    - Write unit tests for components
    - Test API integration
    - Run `npm test` to execute tests

## Best Practices

1. **Component Structure**
    - One component per file
    - Use functional components
    - Implement proper prop typing

2. **State Management**
    - Keep state as local as possible
    - Use context for truly global state
    - Implement proper error boundaries

3. **Performance**
    - Use React.memo for expensive renders
    - Implement proper useCallback/useMemo
    - Optimize images and assets

4. **Code Quality**
    - Follow ESLint rules
    - Write meaningful comments
    - Use consistent naming conventions