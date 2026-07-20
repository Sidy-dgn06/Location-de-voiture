import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly register = new Registry();
  private readonly requestCounter: Counter<string>;

  constructor() {
    collectDefaultMetrics({ register: this.register });
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Nombre total de requêtes HTTP',
      labelNames: ['method', 'route', 'status'] as const,
      registers: [this.register],
    });
  }

  incrementRequest(method: string, route: string, status: string) {
    this.requestCounter.inc({ method, route, status });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
