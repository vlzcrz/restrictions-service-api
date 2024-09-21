import { Module } from '@nestjs/common';
import { RestrictionModule } from './restriction/restriction.module';
import { FirestoreModule } from './firestore/firestore.module';

@Module({
  imports: [RestrictionModule, FirestoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
