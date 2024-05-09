import Oauth from 'oauth-1.0a';
import { HmacSHA1, enc } from 'crypto-js';
import { Buffer } from 'node:buffer';

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

    private async upload_image(image_url: string): Promise<string> {
        const imageResponse = await fetch(image_url);
        const buf = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(buf).toString('base64');

        const requestData = {
            url: 'https://upload.twitter.com/1.1/media/upload.json?media_category=tweet_image',
            method: 'POST',
            data: { media_data: base64 },
        };

        const response = await fetch(requestData.url, {
            method: 'POST',
            headers: {
                ...this.oauth.toHeader(this.oauth.authorize(requestData, this.oauthToken)),
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ media_data: base64 }),
        });
        console.log(this.oauth.toHeader(this.oauth.authorize(requestData, this.oauthToken)));

        const json: { media_id_string: string } = await response.json();
        console.log(response.status);
        console.log(response.statusText);
        console.log(json);
        return json['media_id_string'];
    }

    public async post(text: string | null, image_url: string | null): Promise<Response> {
        if (!text && !image_url) {
            throw new Error('text or image_url is required');
        }

        let mediaId = null;
        if (image_url) {
            mediaId = await this.upload_image(image_url);
        }
        console.log(mediaId);

        const requestAuth = {
            url: 'https://api.twitter.com/2/tweets',
            method: 'POST',
        };
        const reqestBody = JSON.stringify({
            text: text ? text : undefined,
            media: mediaId ? { media_id: mediaId } : undefined,
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
