import { Service, ServiceBroker, Context } from 'moleculer';
import type { ISendpulseParams } from './sendpulse.service';
import type { IServiceCallingResult } from '../custom_types';

export interface IEmailParams {
   email: string;
   content: string;
}

export interface IPersonaltEmailParams {
   firstname: string;
   lastname: string;
   email: string;
}

export class EmailService extends Service
{
   private readonly _email_secret = 'email_secret';

   constructor(broker: ServiceBroker)
   {
      super(broker);

      this.parseServiceSchema({
         name: 'email' as 'email',
         actions:
         {
            send: {
               name: 'send',
               params: {
                  email: 'email',
                  content: 'string',
               },
               handler(ctx: Context<IEmailParams>)  {
                  return this.send(ctx.params);
               },
            },

            confirm: {
               name: 'confirm',
               params: {
                  firstname: 'string',
                  lastname: 'string',
                  email: 'email',
               },
               handler(ctx: Context<IPersonaltEmailParams>)  {
                  return this.confirm(ctx.params);
               },
            },

            greeting: {
               name: 'greeting',
               params: {
                  firstname: 'string',
                  lastname: 'string',
                  email: 'email',
               },
               handler(ctx: Context<IPersonaltEmailParams>)  {
                  return this.greeting(ctx.params);
               },
            },
         },
      });
   }


   public send(params: IEmailParams): Promise<IServiceCallingResult>
   {
      return this.broker.call<IServiceCallingResult, ISendpulseParams>(
         'sendpulse.send',
         {
            secretKey: this._email_secret,
            ...params,
         },
      );
   }

   public confirm(params: IPersonaltEmailParams): Promise<IServiceCallingResult>
   {
      return this.send({
         email: params.email,
         content: `Dear ${params.firstname} ${params.lastname} please follow this link to confirm your email`,
      });
   }

   public greeting(params: IPersonaltEmailParams): Promise<IServiceCallingResult>
   {
      return this.send({
         email: params.email,
         content: `Dear ${params.firstname} ${params.lastname} congratulations on registering on our wonderful website`,
      });
   }
}
