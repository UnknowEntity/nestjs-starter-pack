import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import EmailSchedulingController from './emailSchedule.controller';
import EmailSchedulingService from './emailSchedule.service';

@Module({
  imports: [EmailModule],
  providers: [EmailSchedulingService],
  controllers: [EmailSchedulingController],
})
export class EmailScheduleModule {}
