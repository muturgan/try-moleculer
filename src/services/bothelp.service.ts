import { Context, Service, ServiceBroker, ServiceSchema } from 'moleculer';
import type { IServiceCallingResult } from '../custom_types/index.js';
import type { CheckerFunction } from 'fastest-validator';
import { validatePhoneNumber } from '../utils/index.js';


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
	readonly #MAX_RETRY = -1;


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


	public async send(params: IBothelpParams, maxRetry = this.#MAX_RETRY, tries = 0): Promise<IServiceCallingResult>
	{
		try {
			const result = await this.#fetch(params);
			return result;

		} catch (err) {
			tries++;
			console.info(`sms sending error №${tries}`);

			if (maxRetry === -1 || tries < maxRetry) {
				return this.send(params, maxRetry, tries);
			}

			console.info(err);
			throw err;
		}
	}



	#fetch(params: IBothelpParams): Promise<IServiceCallingResult>
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
