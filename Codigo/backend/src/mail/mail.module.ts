import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { UserModule } from 'src/user/module/user.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'SMTP.office365.com;',
        port: 587,
        secure: false,
        service: 'hotmail',
        auth: {
          user: 'COLOCA_UM_EMAIL_OUTLOOK', // TODO: Arrumar uma conta real pra disparar esses emails
          pass: '**************',
        },
      },
      defaults: {
        from: '"No Reply" COLOCA_UM_OUTLOOK',
      },
      template: {
        dir: join(__dirname, '..', '..', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UserModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
