FROM node:23-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package.json ./
RUN yarn install

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS runner

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]
