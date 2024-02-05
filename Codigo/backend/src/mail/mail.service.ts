import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger('Mail Service');
  constructor(
    private mailerService: MailerService,
    private userService: UserService,
  ) {}

  async sendOrderConfirmation(username: string) {
    try {
      const user = await this.userService.getUserByEmail(username);

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Confirmação de pedido',
        template: './orderConfirmation',
        context: {
          name: user.name,
          apiUrl: process.env.API_URL,
        },
      });

      this.logger.log(`Email enviado com sucesso para  ${username}`);
    } catch (err) {
      this.logger.error(
        `Email não pode ser enviado para 
        ${username}.
        Motivo: 
        ${err}`,
      );
    }
  }
}
