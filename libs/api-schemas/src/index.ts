import { z } from 'zod';
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from 'zod-openapi';

extendZodWithOpenApi(z);

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(1).max(100).optional()
});

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const userSchema = z.object({
  id: z.string().openapi({ example: 'ckxyz123' }),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export function buildOpenApi() {
  const registry = new OpenAPIRegistry();

  registry.register('RegisterRequest', registerRequestSchema);
  registry.register('LoginRequest', loginRequestSchema);
  registry.register('User', userSchema);

  registry.registerPath({
    method: 'post',
    path: '/register',
    description: 'Register a new user',
    request: { body: { content: { 'application/json': { schema: registerRequestSchema } } } },
    responses: {
      200: { description: 'Registered', content: { 'application/json': { schema: z.object({ token: z.string(), user: userSchema }) } } },
      409: { description: 'Conflict' }
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/login',
    description: 'Authenticate a user',
    request: { body: { content: { 'application/json': { schema: loginRequestSchema } } } },
    responses: {
      200: { description: 'Authenticated', content: { 'application/json': { schema: z.object({ token: z.string(), user: userSchema }) } } },
      401: { description: 'Unauthorized' }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/me',
    description: 'Get current user profile',
    responses: { 200: { description: 'Current user', content: { 'application/json': { schema: z.object({ user: userSchema.nullable() }) } } } }
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.3',
    info: { title: 'User Service API', version: '0.1.0' },
    paths: {},
    components: {}
  });
}

export function generateOpenApiJson() {
  return JSON.stringify(buildOpenApi(), null, 2);
}
