import { Request } from 'express';

type TestVariant = 'A' | 'B';

interface ABTest {
  id: string;
  variants: {
    A: { weight: number; config: any };
    B: { weight: number; config: any };
  };
  metrics: {
    A: { impressions: number; conversions: number };
    B: { impressions: number; conversions: number };
  };
}

class ABTestingManager {
  private tests: Map<string, ABTest> = new Map();

  public createTest(testId: string, variantConfigs: {
    A: { weight: number; config: any };
    B: { weight: number; config: any };
  }): void {
    this.tests.set(testId, {
      id: testId,
      variants: variantConfigs,
      metrics: {
        A: { impressions: 0, conversions: 0 },
        B: { impressions: 0, conversions: 0 }
      }
    });
  }

  public getVariant(testId: string, userId: string): TestVariant {
    const test = this.tests.get(testId);
    if (!test) return 'A';

    // Deterministic variant assignment based on userId
    const hash = this.hashString(userId + testId);
    const normalizedHash = hash / Number.MAX_SAFE_INTEGER;
    
    return normalizedHash < test.variants.A.weight ? 'A' : 'B';
  }

  public trackImpression(testId: string, variant: TestVariant): void {
    const test = this.tests.get(testId);
    if (test) {
      test.metrics[variant].impressions++;
    }
  }

  public trackConversion(testId: string, variant: TestVariant): void {
    const test = this.tests.get(testId);
    if (test) {
      test.metrics[variant].conversions++;
    }
  }

  public getTestResults(testId: string): {
    variant: TestVariant;
    conversionRate: number;
  }[] {
    const test = this.tests.get(testId);
    if (!test) return [];

    return ['A', 'B'].map(variant => ({
      variant: variant as TestVariant,
      conversionRate: test.metrics[variant as TestVariant].conversions /
                     test.metrics[variant as TestVariant].impressions || 0
    }));
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

export const abTestingManager = new ABTestingManager();

export const setupABTesting = (): void => {
  // Setup A/B test for recommendation algorithms
  abTestingManager.createTest('recommendation-algorithm', {
    A: {
      weight: 0.5,
      config: { algorithm: 'collaborative-filtering' }
    },
    B: {
      weight: 0.5,
      config: { algorithm: 'content-based' }
    }
  });

  // Log test results periodically
  setInterval(() => {
    const results = abTestingManager.getTestResults('recommendation-algorithm');
    console.log('A/B Test Results:', results);
  }, 3600000); // Log every hour
};