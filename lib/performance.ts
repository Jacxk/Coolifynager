// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);
      
      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [name, times] of this.metrics.entries()) {
      result[name] = this.getAverageTime(name);
    }
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// React performance hooks
export function usePerformanceTimer(name: string) {
  return PerformanceMonitor.getInstance().startTimer(name);
}

// Component render performance tracking
export function withPerformanceTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
): React.ComponentType<T> {
  return React.memo((props: T) => {
    const endTimer = usePerformanceTimer(`${componentName}_render`);
    
    React.useEffect(() => {
      endTimer();
    });
    
    return <Component {...props} />;
  });
}

// API call performance tracking
export async function trackApiCall<T>(
  name: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const endTimer = PerformanceMonitor.getInstance().startTimer(`api_${name}`);
  
  try {
    const result = await apiCall();
    return result;
  } finally {
    endTimer();
  }
}

// Memory usage monitoring
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }
  
  return { used: 0, total: 0, percentage: 0 };
}

// Bundle size monitoring
export function logBundleInfo(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Performance Monitor initialized');
    console.log('Memory usage:', getMemoryUsage());
  }
}