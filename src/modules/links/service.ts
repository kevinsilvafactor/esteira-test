import { CollisionError, InvalidUrlError, LinkNotFoundError } from "../../shared/errors.js"
import type { CodeGenerator } from "./code-generator.js"
import type { LinkRepository } from "./repository.js"
import type { Link } from "./types.js"

export interface LinkServiceDependencies {
  repository: LinkRepository
  generateCode: CodeGenerator
  now?: () => Date
  maxAttempts?: number
}

export interface CreatedLink { code: string; shortUrl: string }

export class LinkService {
  private readonly now: () => Date
  private readonly maxAttempts: number

  public constructor(private readonly dependencies: LinkServiceDependencies, private readonly shortBaseUrl: string) {
    this.now = dependencies.now ?? (() => new Date())
    this.maxAttempts = dependencies.maxAttempts ?? 5
  }

  public create(originalUrl: string): CreatedLink {
    this.validateUrl(originalUrl)
    for (let attempt = 0; attempt < this.maxAttempts; attempt += 1) {
      const code = this.dependencies.generateCode()
      try {
        this.dependencies.repository.create({ code, originalUrl, createdAt: this.now().toISOString() })
        return { code, shortUrl: `${this.shortBaseUrl}/${code}` }
      } catch (error: unknown) {
        if (!this.isUniqueViolation(error)) throw error
      }
    }
    throw new CollisionError()
  }

  public resolve(code: string): Link {
    const link = this.dependencies.repository.findByCode(code)
    if (!link) throw new LinkNotFoundError()
    return link
  }

  private validateUrl(value: string): void {
    try {
      const parsed = new URL(value)
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error()
    } catch {
      throw new InvalidUrlError()
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return error instanceof Error && /unique constraint failed: links\.code/i.test(error.message)
  }
}