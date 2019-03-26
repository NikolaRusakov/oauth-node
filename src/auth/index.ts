// @ts-ignore
import pass from 'passport-oauth2';
import {config} from 'dotenv'
import passport from 'passport';

// @ts-ignore
// import {Client4 as mattermost} from 'mattermost-redux/client';

// import * as mm from 'mattermost-redux'

// import {Strategy as OAuth2Strategy} from 'passport-oauth2';

const result = config();
const OAuth2Strategy = require('passport-oauth2');
// import {Strategy as OAuth2Strategy} from 'passport-oauth2';
// @ts-ignore
import {Client4 as mattermost} from 'mattermost-redux/client';


var MmAuth = {
    url: null,
    setUrl(mattermostUrl: null) {
        this.url = mattermostUrl;

        const oauth2Strategy = new OAuth2Strategy({
            authorizationURL: `${process.env.MATTERMOST_URL}/oauth/authorize`,
            tokenURL: `${process.env.MATTERMOST_URL}/oauth/access_token`,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `${process.env.CLIENT_URL}/oauth/callback`
        }, (accessToken: any, refreshToken: any, profile: { accessToken: any; refreshToken: any; }, cb: (arg0: null, arg1: any) => void) => {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            console.log(accessToken);
            return cb(null, profile);
        });

        oauth2Strategy.userProfile = (accessToken: any, done: (err: any, data?: any) => void) => {
            mattermost.setUrl(MmAuth.url);
            mattermost.setToken(accessToken);
            console.log(mattermost);
            // @ts-ignore
            mattermost.getMe().then((data) => {
                done(null, data);
                // @ts-ignore
            }). catch((err) => {
                done(err);
            });
           /* mattermost.getMe().then((data: any) => {
                done(null, data);
            }).catch((err: any) => {
                done(err);
            });*/
        };

        passport.use(oauth2Strategy);
    }
};

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export const AuthStrategy = /* {
    url: '',
    setUrl(mattermostUrl = '') {
        this.url = mattermostUrl;
*/
    new OAuth2Strategy({
        authorizationURL: `${process.env.MATTERMOST_URL}/oauth/authorize`,
        tokenURL: `${process.env.MATTERMOST_URL}/oauth/access_token`,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.CLIENT_URL}/oauth/callback`
    }, (accessToken: any, refreshToken: any, profile: { accessToken: any; refreshToken: any; }, cb: (arg0: null, arg1: any) => void) => {
        console.log(profile);
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        return cb(null, profile);
    });

/*  oauth2Strategy.userProfile = (accessToken, done) => {
      mattermost.setUrl(AuthStrategy.url);
      mattermost.setToken(accessToken);
      mattermost.getMe().then((data) => {
          done(null, data);
      }).catch((err) => {
          done(err);
      });
  };
  */

export const auth = {
    url: '',
    setUrl(mattermostUrl = 'http://localhost') {
        this.url = mattermostUrl;
        console.log(this.url);
        const oauth2Strategy = new OAuth2Strategy({
            authorizationURL: `${process.env.MATTERMOST_URL}/oauth/authorize`,
            tokenURL: `${process.env.MATTERMOST_URL}/oauth/access_token`,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `${process.env.CLIENT_URL}/oauth/callback`
        }, (accessToken: any, refreshToken: any, profile: { accessToken: any; refreshToken: any; }, cb: (arg0: null, arg1: any) => void) => {
            console.log(accessToken);
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            return cb(null, profile);
        });

        oauth2Strategy.userProfile = (accessToken: any, done: { (arg0: null, arg1: any): void; (arg0: any): void; }) => {
            mattermost.setUrl(auth.url);
            mattermost.setToken(accessToken);
            mattermost.getMe().then((data: any) => {
                done(null, data);
            }).catch((err: any) => {
                done(err);
            });
        };

        // passport.use(oauth2Strategy);
        return oauth2Strategy
    }
};

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
