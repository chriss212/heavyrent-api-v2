import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import 'dotenv/config'

console.log('Ver archivo env', process.env.DB_USERNAME)
console.log('ver archivo env', process.env.DB_HOST)
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
            scope: ['email', 'profile'],
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function,
    ) {
        const name = profile.name
        const emails = profile.emails

    if (!emails || emails.length === 0) {
            return done(new Error('No email found in Google profile'), null);
        }

        if (!name || !name.givenName || !name.familyName) {
            return done(new Error('Incomplete name in Google profile'), null);
        }

        const user = {
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
        };

        done(null, user);
}
}