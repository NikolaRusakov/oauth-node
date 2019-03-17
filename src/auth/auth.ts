// @ts-ignore
import {Client4} from "mattermost-redux/client";
// @ts-ignore
import {Strategy as OAuth2Strategy} from 'passport-oauth2';

const passport = require('passport');
require('dotenv').config();

require('es6-promise').polyfill();
require('isomorphic-fetch');

var mmAuth = {
    url: '',
    setUrl(mattermostUrl: string) {
        this.url = mattermostUrl;
        const oauth2Strategy = new OAuth2Strategy.Strategy({
            authorizationURL: `${process.env.MATTERMOST_URL}/oauth/authorize`,
            tokenURL: `${process.env.MATTERMOST_URL}/oauth/access_token`,
            clientID: `${process.env.CLIENT_ID}`,
            clientSecret: `${process.env.CLIENT_SECRET}`,
            callbackURL: `${process.env.CLIENT_URL}/oauth/callback`
        }, (accessToken: any, refreshToken: any, profile: { accessToken: any; refreshToken: any; }, cb: (arg0: null, arg1: any) => void) => {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            return cb(null, profile);
        });

        oauth2Strategy.userProfile = async (accessToken, done) => {
            Client4.setUrl(mmAuth.url);
            Client4.setToken(accessToken);
            let user;
            try {
                user = await Client4.getMe();
                done(null, user);
            } catch (error) {
                console.error(error);
                done(error);
            }
            return user;
        };

        passport.use(oauth2Strategy);
    }
};

passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user);
});

passport.deserializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
    done(null, user);
});

module.exports = mmAuth;
