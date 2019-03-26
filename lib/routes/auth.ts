import {Request, Response, Application} from "express";
import passport from 'passport';

var admin = require("firebase-admin");
var serviceAccount = require('./../../service-account.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
});

// const OAuth2Strategy = require('passport-oauth2');

// @ts-ignore
import auth from "../../src/auth/auth.ts";

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
                    console.log('doesn\'t exist');
                }


                admin.auth().getUser(user.accessToken).then(function (userRecord: any) {
                    console.log("Successfully fetched user data:", userRecord.toJSON());
                    console.log(userRecord.uid);
                    admin.auth().createCustomToken(userRecord.uid)
                        .then(function (customToken: any) {
                            res.redirect(302, `${process.env.APP_URL}/token-redirect/${customToken}`)
                        })
                        .catch(function (error: any) {
                            console.log("Error creating custom token:", error);
                        });

                }).catch(() => {
                    const displayName = user.first_name && user.last_name ?
                        `${user.first_name} ${user.last_name}` : user.username;

                    admin.auth().createUser({
                        uid: user.accessToken,
                        email: user.email,
                        emailVerified: true,
                        displayName: displayName,
                        disabled: false
                    }).then((userRecord: any) => {
                            console.log("Successfully created new user:", userRecord.uid);
                            admin.auth().createCustomToken(userRecord.uid)
                                .then(function (customToken: any) {
                                    res.redirect(302, `${process.env.APP_URL}/token-redirect/${customToken}`)
                                })
                                .catch(function (error: any) {
                                    console.log("Error creating custom token:", error);
                                });
                        }
                    )
                });
                /*
                let accessToken = {
                    token: ''
                };


                admin.auth().getUser()
                const authRef = db.collection('mm-auth').doc(`${user.id}`);
                authRef.get()
                    .then((doc: any) => {
                        if (!doc.exists) {
                            authRef.set(user);
                            accessToken = {...accessToken, token: user.accessToken}
                        } else {
                            console.log(doc.data());
                            accessToken = {...accessToken, token: user.accessToken}
                        }
                    })
                    .catch((err: any) => {
                        console.log('Error getting document', err);
                    });
*/
            })(req, res, next)
        })
    }
}
