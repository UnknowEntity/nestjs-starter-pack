import { BadRequestException, Injectable } from '@nestjs/common';
import EmailScheduleDto from './dto/emailSchedule.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import EmailService from 'src/email/email.service';
import * as moment from 'moment';

@Injectable()
export default class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    if (moment().isAfter(emailSchedule.date)) {
      throw new BadRequestException('Date in past. Will never be fired');
    }
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      console.log('Exercuted');
      this.emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );
    job.start();
  }

  cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }
}
