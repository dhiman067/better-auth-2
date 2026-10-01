import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_USER_MONGODB);
const db = client.db('better_auth_db_2');
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_LOGIN_CLIENT_ID,
            clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
        },

    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: user.email,
                subject: 'Verify your email address',
                html: `Click <a href="${url}">here</a> to verify your email.`,
            });
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600 // 1 hour
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
});