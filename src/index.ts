import Twitter from './twitter';

export interface Env {
    TWITTER_BEARER_TOKEN: string;
    TWITTER_CONSUMER_API_KEY: string;
    TWITTER_CONSUMER_API_SECRET: string;
    TWITTER_ACCESS_TOKEN: string;
    TWITTER_ACCESS_TOKEN_SECRET: string;
}

const hiraganaStart = 0x3041;
const hiraganaEnd = 0x3096;

function getRandomHiragana(len: number): string {
    let result = '';
    for (let i = 0; i < len; i++) {
        const randomCode = Math.floor(Math.random() * (hiraganaEnd - hiraganaStart + 1)) + hiraganaStart;
        result += String.fromCharCode(randomCode);
    }

    return result;
}

async function post(env: Env): Promise<Response> {
    const twitter = new Twitter(
        env.TWITTER_CONSUMER_API_KEY,
        env.TWITTER_CONSUMER_API_SECRET,
        env.TWITTER_ACCESS_TOKEN,
        env.TWITTER_ACCESS_TOKEN_SECRET
    );

    const text = getRandomHiragana(3);
    return twitter.post(text, 'https://images.ygoprodeck.com/images/cards/3909436.jpg');
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const response = await post(env);
        return new Response(JSON.stringify({ status: response.status, message: response.statusText }), {
            headers: { 'Content-Type': 'application/json' },
        });
    },

    async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
        ctx.waitUntil(post(env));
    },
};
