import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';
import type { IServiceCallingResult } from '../custom_types/index.js';


export interface ISendpulseParams {
	email: string;
	content: string;
	secretKey: string;
}

export interface ISendpulseService extends ServiceSchema {
	name: 'sendpulse';
	actions: {
		send: {
			name: 'send';
			params: {
				email: 'email';
				content: 'string';
				secretKey: 'string';
			};
			handler: (ctx: Context<ISendpulseParams, {}>) => Promise<IServiceCallingResult>;
		};
	};
}

export class SendpulseService extends Service
{
	readonly #MAX_RETRY = -1;


	constructor(broker: ServiceBroker)
	{
		super(broker);

		this.parseServiceSchema({
			name: 'sendpulse',
			actions: {
				send: {
					name: 'send',
					params: {
						email: 'email',
						content: 'string',
						secretKey: 'string',
					},
					handler: (ctx: Context<ISendpulseParams>): Promise<IServiceCallingResult> => {
						return this.send(ctx.params);
					},
				},
			},
		});
	}


	public async send(params: ISendpulseParams, maxRetry = this.#MAX_RETRY, tries = 0): Promise<IServiceCallingResult>
	{
		try {
			const result = await this.#fetch(params);
			return result;

		} catch (err) {
			tries++;
			console.info(`email sending error №${tries}`);

			if (maxRetry === -1 || tries < maxRetry) {
				return this.send(params, maxRetry, tries);
			}

			console.info(err);
			throw err;
		}
	}



	#fetch(params: ISendpulseParams): Promise<IServiceCallingResult>
	{
		return new Promise((resolve, reject) => {
			setTimeout(() =>
			{
				console.info({email_params: params});

				const success = Date.now() % 2 === 0;
				if (success === false) {
					console.error('email sending error');
					return reject({
						success: false,
						message: 'email sending error',
					});
				}
				console.info('email sending success');
				return resolve({
					success: true,
					message: 'email sending success',
				});

			}, 250);
		});
	}
}
