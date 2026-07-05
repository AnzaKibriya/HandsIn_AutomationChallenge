FROM node:22-bookworm

# Setup pnpm global store
ENV PNPM_HOME="/workspaces/.pnpm-global"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable 

ENV NX_DAEMON="true"
