export const todoKeys = {
    all: ['todo'] as const,
    lists: () => [todoKeys.all, 'list'] as const,
    details: () => [todoKeys.all, 'detail'] as const,
};