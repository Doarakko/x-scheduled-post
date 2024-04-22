# x-bot-playground

Post to X(Twitter) regularly using Cloudflare.

## Requirements

- Cloudflare
- Twitter Account
- wrangler CLI
- npm

## Usage

1. Clone the repository

   ```bash
   npx wrangler generate x-bot-playground https://github.com/Doarakko/x-bot-playground
   npm i
   ```

1. Configure cron, default is once every hour

   `wrandler.toml`

   ```toml
   [triggers]
   crons = ["0 * * * *"]
   ```

1. Deploy to Cloudflare

   ```bash
   wrangler deploy
   ```

1. Set environmental variables to Cloudflare

   ```bash
   wrangler secret put TWITTER_CONSUMER_API_KEY
   wrangler secret put TWITTER_CONSUMER_API_SECRET
   wrangler secret put TWITTER_ACCESS_TOKEN
   wrangler secret put TWITTER_ACCESS_TOKEN_SECRET
   ```

## Hints

### Run on local

1. Setup the environment variables

   ```bash
   cp .dev.vars.example .dev.vars
   ```

1. Run the worker

   ```bash
   wrangler dev
   ```

### Check if you can post

Remove this comment out and access to your URL.

`src/index.ts`

```typescript
export default {
    // async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    //     const response = await post(env);
    //     return new Response(JSON.stringify({ status: response.status, message: response.statusText }), {
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // },

```

## References

- [Sending a message with the Twitter API in a Cloudflare worker](https://www.leopradel.com/blog/use-twitter-api-clouflare-worker)
- [Cloudflare Docs: Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
