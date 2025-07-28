import React, { Suspense, lazy } from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';

// Loading component for lazy-loaded components
const LazyLoadingFallback = () => (
  <View className="p-4">
    <Skeleton className="w-full h-20 mb-2" />
    <Skeleton className="w-3/4 h-4 mb-1" />
    <Skeleton className="w-1/2 h-4" />
  </View>
);

// Enhanced lazy loading with error boundaries and loading states
export function createLazyComponent<T extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc);
  
  return React.memo((props: T) => (
    <Suspense fallback={fallback ? <fallback /> : <LazyLoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  ));
}

// Lazy load components with specific loading states
export const LazyComponents = {
  // Lazy load heavy components that are not immediately needed
  DangerScreen: createLazyComponent(() => import('@/components/DangerScreen')),
  LogsViewer: createLazyComponent(() => import('@/components/LogsViewer')),
  HealthDialog: createLazyComponent(() => import('@/components/HealthDialog')),
  InfoDialog: createLazyComponent(() => import('@/components/InfoDialog')),
};

// Route-based code splitting
export const LazyRoutes = {
  // Lazy load route components
  ApplicationDetails: createLazyComponent(() => import('@/app/main/applications/[uuid]/(tabs)')),
  ServiceDetails: createLazyComponent(() => import('@/app/main/services/[uuid]/(tabs)')),
  DatabaseDetails: createLazyComponent(() => import('@/app/main/databases/[uuid]/(tabs)')),
  ProjectDetails: createLazyComponent(() => import('@/app/main/projects/[uuid]')),
  ServerDetails: createLazyComponent(() => import('@/app/main/servers/[uuid]')),
  TeamDetails: createLazyComponent(() => import('@/app/main/teams/[id]')),
};

// Preload components for better perceived performance
export function preloadComponent<T extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>
) {
  return () => {
    importFunc();
  };
}

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be needed soon
  setTimeout(() => {
    import('@/components/DangerScreen');
    import('@/components/LogsViewer');
  }, 2000);
};

// Conditional loading based on user interaction
export function useConditionalLoading<T extends object>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  condition: boolean
) {
  const [Component, setComponent] = React.useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (condition && !Component && !isLoading) {
      setIsLoading(true);
      importFunc()
        .then((module) => {
          setComponent(() => module.default);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [condition, Component, isLoading, importFunc]);

  return { Component, isLoading };
}