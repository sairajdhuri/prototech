import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

// Native TypeScript test loading, including the application's @/ path alias.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (context.conditions?.includes('require')) return nextResolve(specifier, context);
  if (specifier === 'next/server') return nextResolve('next/server.js', context);
  const candidate = specifier.startsWith('@/') ? path.resolve('src', specifier.slice(2)) : specifier.startsWith('.') && context.parentURL ? path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier) : null;
  if (candidate) for (const extension of ['.ts', '.tsx']) {
    if (existsSync(candidate + extension)) return nextResolve(pathToFileURL(candidate + extension).href, context);
  }
  return nextResolve(specifier, context);
} });
