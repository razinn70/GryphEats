// Shared type & event schemas (initial placeholders)
export interface DomainEventBase { id: string; type: string; occurredAt: string; version: number; }

export interface UserRegisteredEvent extends DomainEventBase { type: 'user.registered'; payload: { userId: string; email: string }; }
export interface RecipeCreatedEvent extends DomainEventBase { type: 'recipe.created'; payload: { recipeId: string; authorId: string; title: string }; }

export type DomainEvent = UserRegisteredEvent | RecipeCreatedEvent; // extend as needed
