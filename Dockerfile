FROM oven/bun:0.5.9
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY ./src ./src
EXPOSE 3000
ENTRYPOINT ["bun", "src/index.js"]