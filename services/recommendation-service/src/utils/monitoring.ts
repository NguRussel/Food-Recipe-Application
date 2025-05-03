import { Request, Response, NextFunction } from 'express';

export interface RecommendationMetrics {
  totalRecommendations: number;
  clickThroughRate: number;
  userSatisfactionScore: number;
  algorithmLatency: number;
}

class MetricsCollector {
  private metrics: RecommendationMetrics = {
    totalRecommendations: 0,
    clickThroughRate: 0,
    userSatisfactionScore: 0,
    algorithmLatency: 0
  };

  public trackRecommendation(latency: number): void {
    this.metrics.totalRecommendations++;
    this.metrics.algorithmLatency = 
      (this.metrics.algorithmLatency * (this.metrics.totalRecommendations - 1) + latency) / 
      this.metrics.totalRecommendations;
  }

  public trackClick(recommended: boolean): void {
    if (recommended) {
      this.metrics.clickThroughRate = 
        (this.metrics.clickThroughRate * this.metrics.totalRecommendations + 1) /
        (this.metrics.totalRecommendations + 1);
    }
  }

  public trackSatisfaction(score: number): void {
    this.metrics.userSatisfactionScore = 
      (this.metrics.userSatisfactionScore * this.metrics.totalRecommendations + score) /
      (this.metrics.totalRecommendations + 1);
  }

  public getMetrics(): RecommendationMetrics {
    return this.metrics;
  }
}

export const metricsCollector = new MetricsCollector();

export const monitoringMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on('finish', () => {
    const latency = Date.now() - start;
    if (req.path.includes('/recommendations')) {
      metricsCollector.trackRecommendation(latency);
    }
  });

  next();
};

export const setupMonitoring = (): void => {
  setInterval(() => {
    const metrics = metricsCollector.getMetrics();
    console.log('Recommendation Metrics:', metrics);
    // Here you could send metrics to a monitoring service
  }, 60000); // Log metrics every minute
};