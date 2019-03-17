import {Request, Response, Application, Router} from "express";
import passport from 'passport';

const fs = require('fs')

// import {OAuth2Strategy} from 'passport-oauth2';
const OAuth2Strategy = require('passport-oauth2');

// @ts-ignore
import {auth} from "../../src/auth";

auth.setUrl('http://localhost');

export class Routes {
    public routes(app: Application): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            });

        app.route('/login').get(passport.authenticate('oauth2'), ((req, res) => {
            console.log('successful');
            res.send(req)
        }));
        app.route('/oauth/callback').get((req, res, next) => {
            console.log('successful cb');
            // console.log(req);

            passport.authenticate('oauth2', (err, user) => {
                console.log(user);
                if (err) {
                    return next(err);
                }
                if (req.query.error) {
                    console.log(req.query.error);
                }
                if (!user) {
                    console.log('doesn exist');
                    // console.log(user);
                }
                console.log(user.accessToken, user.refreshToken);

                const accessTokens = {
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken
                };

                // res.render('redirect', {accessTokens});
                console.log(process.env.APP_URL);
                res.redirect(302, `${process.env.APP_URL}/token-redirect/${accessTokens.accessToken}`)

            })(req, res, next)
        })
    }
}