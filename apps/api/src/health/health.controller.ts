import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { ApiTags } from "@nestjs/swagger";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { DatabaseHealthIndicator } from "./database.health.js";

@ApiTags("health")
@AllowAnonymous()
@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
  ) {}

  // Liveness: the process answers. Never checks dependencies, so an orchestrator
  // does not restart healthy pods while the database is down.
  @Get("live")
  @HealthCheck()
  live() {
    return this.health.check([]);
  }

  // Readiness and dependency status: 503 when any dependency is down, with
  // per-dependency details the web app can use to show degraded features.
  @Get("ready")
  @HealthCheck()
  ready() {
    return this.health.check([() => this.database.isHealthy("database")]);
  }
}
