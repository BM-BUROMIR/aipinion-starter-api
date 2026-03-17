/** JWT payload stored in Hono context after auth middleware */
export interface JwtPayload {
  sub: string;
  email?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  iss?: string;
}

/** Hono context variables set by middleware */
export interface AppVariables {
  user: JwtPayload;
}

/** Example entity */
export interface Example {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/** Request body for creating/updating an example */
export interface ExampleInput {
  title: string;
  description: string;
}
