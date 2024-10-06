import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: Firestore,
      useFactory: () => {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
          }),
        });
        return admin.firestore();
      },
    },
  ],
  exports: [Firestore],
})
export class FirestoreModule {}
