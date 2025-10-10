import React, { Suspense } from 'react';

// Loading component for suspense fallback
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    minHeight: '200px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }}></div>
    <p style={{ color: '#666', fontSize: '14px' }}>{message}</p>
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Higher-order component for lazy loading with error boundary
const withLazyLoading = (Component, fallbackMessage) => {
  return React.forwardRef((props, ref) => (
    <Suspense fallback={<LoadingSpinner message={fallbackMessage} />}>
      <Component {...props} ref={ref} />
    </Suspense>
  ));
};

// Lazy-loaded components using React.lazy()
export const LazyAIAssistant = withLazyLoading(
  React.lazy(() => import('./AIAssistant')),
  "Loading AI Assistant..."
);

export const LazyTruckDetail = withLazyLoading(
  React.lazy(() => import('../pages/TruckDetail')),
  "Loading vehicle details..."
);

export const LazyCarsPage = withLazyLoading(
  React.lazy(() => import('../pages/CarsPage')),
  "Loading cars marketplace..."
);

export const LazyMotorcyclesPage = withLazyLoading(
  React.lazy(() => import('../pages/MotorcyclesPage')),
  "Loading motorcycles..."
);

export const LazyEBikesPage = withLazyLoading(
  React.lazy(() => import('../pages/EBikesPage')),
  "Loading e-bikes..."
);

export const LazyCaravansPage = withLazyLoading(
  React.lazy(() => import('../pages/CaravansPage')),
  "Loading caravans..."
);

export const LazyAIDemo = withLazyLoading(
  React.lazy(() => import('../pages/AIDemo')),
  "Loading AI Demo..."
);

export const LazySecurityDashboard = withLazyLoading(
  React.lazy(() => import('../pages/SecurityDashboard')),
  "Loading security dashboard..."
);

export const LazyPerformanceDashboard = withLazyLoading(
  React.lazy(() => import('../pages/PerformanceDashboard')),
  "Loading performance dashboard..."
);

export const LazyAdvancedAI = withLazyLoading(
  React.lazy(() => import('../pages/AdvancedAIDashboard')),
  "Loading advanced AI features..."
);

export const LazyTermsConditions = withLazyLoading(
  React.lazy(() => import('../pages/TermsConditions')),
  "Loading terms and conditions..."
);

export const LazyAbout = withLazyLoading(
  React.lazy(() => import('../pages/About')),
  "Loading about page..."
);

export const LazyLogin = withLazyLoading(
  React.lazy(() => import('../pages/Login')),
  "Loading login..."
);

// Utility function to preload components
export const preloadComponent = (importFunction) => {
  return () => {
    importFunction();
    return null;
  };
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload AI Assistant as it's commonly used
  import('./AIAssistant');
  
  // Preload main pages
  import('../pages/TruckDetail');
  import('../pages/CarsPage');
};

export default {
  LazyAIAssistant,
  LazyTruckDetail,
  LazyCarsPage,
  LazyMotorcyclesPage,
  LazyEBikesPage,
  LazyCaravansPage,
  LazyAIDemo,
  LazySecurityDashboard,
  LazyPerformanceDashboard,
  LazyAdvancedAI,
  LazyTermsConditions,
  LazyAbout,
  LazyLogin,
  preloadComponent,
  preloadCriticalComponents
};
