import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import * as serviceAccount from '../config/restriction-service-ads-firebase-adminsdk.json';

@Global()
@Module({
  providers: [
    {
      provide: Firestore,
      useFactory: () => {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
        return admin.firestore();
      },
    },
  ],
  exports: [Firestore],
})
export class FirestoreModule {}
