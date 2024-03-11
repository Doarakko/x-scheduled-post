import Oauth from 'oauth-1.0a';
import { HmacSHA1, enc } from 'crypto-js';

export default class Twitter {
    private readonly oauth;
    private readonly oauthToken: OAuth.Token;

    constructor(consumerApiKey: string, consumerApiSecret: string, accessToken: string, accessTokenSecret: string) {
        this.oauth = new Oauth({
            consumer: {
                key: consumerApiKey,
                secret: consumerApiSecret,
            },
            signature_method: 'HMAC-SHA1',
            hash_function(baseString, key) {
                return HmacSHA1(baseString, key).toString(enc.Base64);
            },
        });

        this.oauthToken = {
            key: accessToken,
            secret: accessTokenSecret,
        };
    }

    public async post(text: string): Promise<Response> {
        const requestAuth = {
            url: 'https://api.twitter.com/2/tweets',
            method: 'POST',
        };

        const reqestBody = JSON.stringify({
            text: text,
        });

        return fetch(requestAuth.url, {
            method: requestAuth.method,
            headers: {
                ...this.oauth.toHeader(this.oauth.authorize(requestAuth, this.oauthToken)),
                'Content-Type': 'application/json',
            },
            body: reqestBody,
        });
    }
}
