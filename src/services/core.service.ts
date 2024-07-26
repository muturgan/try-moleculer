import { Context, Service, ServiceBroker } from 'moleculer';
import type { IPersonaltEmailParams } from './email.service.js';
import type { IPersonalSmsParams } from './sms.service.js';
import type { IRegistrationForm, IServiceCallingResult } from '../custom_types/index.js';
import { validatePhoneNumber } from '../utils/index.js';



export class CoreService extends Service
{
	constructor(broker: ServiceBroker)
	{
		super(broker);

		this.parseServiceSchema({
			name: 'core',
			actions:
			{
				registration: {
					name: 'registration',
					params: {
						firstname: 'string',
						lastname: 'string',
						email: 'email',
						phone: {
							type: 'string',
							custom: validatePhoneNumber,
						},
					},
					handler(ctx: Context<IRegistrationForm>)  {
						return this.registration(ctx.params);
					},
				},
			},
		});
	}


	public async registration(form: IRegistrationForm): Promise<IServiceCallingResult>
	{
		const {firstname, lastname, email, phone} = form;

		await Promise.all([
			this.emailConfirm({firstname, lastname, email}),
			this.phoneNumberConfirm({firstname, lastname, phone}),
		]);

		await this.greeting({firstname, lastname, email});

		return {
			success: true,
			message: 'registration successful',
		};
	}


	public emailConfirm(params: IPersonaltEmailParams): Promise<IServiceCallingResult>
	{
		return this.broker.call<IServiceCallingResult, IPersonaltEmailParams>(
			'email.confirm',
			{...params},
		);
	}


	public phoneNumberConfirm(params: IPersonalSmsParams): Promise<IServiceCallingResult>
	{
		return this.broker.call<IServiceCallingResult, IPersonalSmsParams>(
			'sms.confirm',
			{...params},
		);
	}


	public greeting(params: IPersonaltEmailParams): Promise<IServiceCallingResult>
	{
		return this.broker.call<IServiceCallingResult, IPersonaltEmailParams>(
			'email.greeting',
			{...params},
		);
	}

}
