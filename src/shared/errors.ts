export class LinkNotFoundError extends Error {
  public constructor() {
    super("Link not found")
    this.name = "LinkNotFoundError"
  }
}

export class CollisionError extends Error {
  public constructor() {
    super("Could not allocate a unique short code")
    this.name = "CollisionError"
  }
}

export class InvalidUrlError extends Error {
  public constructor() {
    super("url must be a valid HTTP or HTTPS URL")
    this.name = "InvalidUrlError"
  }
}