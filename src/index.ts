import Oauth from "oauth-1.0a";
import { HmacSHA1, enc } from 'crypto-js';

export interface Env {
    TWITTER_BEARER_TOKEN: string;
    TWITTER_CONSUMER_API_KEY: string;
    TWITTER_CONSUMER_API_SECRET: string;
    TWITTER_ACCESS_TOKEN: string;
    TWITTER_ACCESS_TOKEN_SECRET: string;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        console.log(env);
        const oauth = new Oauth({
            consumer: {
                key: env.TWITTER_CONSUMER_API_KEY,
                secret: env.TWITTER_CONSUMER_API_SECRET
            },
            signature_method: 'HMAC-SHA1',
            hash_function(baseString, key) {
                return HmacSHA1(baseString, key).toString(enc.Base64);
              },
        });

        const oauthToken: OAuth.Token = {
            key: env.TWITTER_ACCESS_TOKEN,
            secret: env.TWITTER_ACCESS_TOKEN_SECRET,
        };

        const requestAuth = {
            url: 'https://api.twitter.com/2/tweets',
            method: 'POST',
        };

        const reqestBody = JSON.stringify({
            text: "Hello World from Cloudflare Workers!",
        });

        const response = await fetch(requestAuth.url, {
            method: requestAuth.method,
            headers: {
                ...oauth.toHeader(oauth.authorize(requestAuth, oauthToken)),
                'Content-Type': 'application/json',
            },
            body: reqestBody,
        });

        return new Response(
            JSON.stringify({ status: response.status, message: response.statusText }), 
            { headers: { 'Content-Type': 'application/json' } }
        );
    },
};
