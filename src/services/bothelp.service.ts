import { Service, ServiceBroker, ServiceSchema, Context } from 'moleculer';
import type { IServiceCallingResult } from '../custom_types';
import type { CheckerFunction } from 'fastest-validator';
import { validatePhoneNumber } from '../utils';
// import { from, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';


export interface IBothelpParams {
   phone: string;
   secretKey: string;
}

export interface IBothelpService extends ServiceSchema {
   name: 'bothelp';
   actions: {
      send: {
         name: 'send';
         params: {
            phone: { type: 'string', custom: CheckerFunction<string> };
            secretKey: 'string';
         };
         handler: (ctx: Context<IBothelpParams, {}>) => Promise<IServiceCallingResult>;
      };
   };
}

export class BothelpService extends Service
{
   constructor(broker: ServiceBroker)
   {
      super(broker);

      this.parseServiceSchema({
         name: 'bothelp',
         actions: {
            send: {
               name: 'send',
               params: {
                  phone: {
                     type: 'string',
                     custom: validatePhoneNumber,
                  },
                  secretKey: 'string',
               },
               handler: (ctx: Context<IBothelpParams>): Promise<IServiceCallingResult> => {
                  return this.send(ctx.params);
               },
            },
         },
      });
   }


   public send(params: IBothelpParams): Promise<IServiceCallingResult>
   {
      return this._fetch(params)
         .catch(() => {
            console.info(`sms sending error №1`);
            return this._fetch(params);
         })
         .catch(() => {
            console.info(`sms sending error №2`);
            return this._fetch(params);
         })
         .catch((err) => {
            console.info(`sms sending error №3`);
            throw err;
         });

      // let count = 0;

      // return from(this._fetch(params))
      //    .pipe(
      //       catchError((err, _caught) =>
      //       {
      //          count++;
      //          console.info(`sms sending error №${count}`);
      //          return count < retriesCount
      //             ? from(this._fetch(params))
      //             : throwError(err);
      //       }),
      //    )
      //    .toPromise();
   }



   private _fetch(params: IBothelpParams): Promise<IServiceCallingResult>
   {
      return new Promise((resolve, reject) => {
         setTimeout(() =>
         {
            console.info({sms_params: params});

            const success = Date.now() % 2 === 0;
            if (success === false) {
               console.error('sms sending error');
               return reject({
                  success: false,
                  message: 'sms sending error',
               });
            }
            console.info('sms sending success');
            return resolve({
               success: true,
               message: 'an sms was sent successfuly',
            });

         }, 250);
      });
   }
}