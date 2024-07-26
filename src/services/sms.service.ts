import { Context, Service, ServiceBroker } from 'moleculer';
import type { IBothelpParams } from './bothelp.service.js';
import type { IServiceCallingResult } from '../custom_types/index.js';
import { validatePhoneNumber } from '../utils/index.js';


export interface ISmsParams {
	phone: string;
	message: string;
}

export interface IPersonalSmsParams {
	firstname: string;
	lastname: string;
	phone: string;
}


export class SmsService extends Service
{
	readonly #sms_secret = 'sms_secret';

	constructor(broker: ServiceBroker)
	{
		super(broker);

		this.parseServiceSchema({
			name: 'sms' as const,
			actions:
			{
				send: {
					name: 'send',
					params: {
						phone: {
							type: 'string',
							custom: validatePhoneNumber,
						},
						message: 'string',
					},
					handler(ctx: Context<ISmsParams>)  {
						return this.send(ctx.params);
					},
				},

				confirm: {
					name: 'confirm',
					params: {
						firstname: 'string',
						lastname: 'string',
						phone: {
							type: 'string',
							custom: validatePhoneNumber,
						},
					},
					handler(ctx: Context<IPersonalSmsParams>)  {
						return this.confirm(ctx.params);
					},
				},
			},
		});
	}


	public send(params: ISmsParams): Promise<IServiceCallingResult>
	{
		return this.broker.call<IServiceCallingResult, IBothelpParams>(
			'bothelp.send',
			{
				secretKey: this.#sms_secret,
				...params,
			},
		);
	}

	public confirm(params: IPersonalSmsParams): Promise<IServiceCallingResult>
	{
		return this.send({
			phone: params.phone,
			message: `Dear ${params.firstname} ${params.lastname} please enter a code 42 to confirm your phone number`,
		});
	}
}
