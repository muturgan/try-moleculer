import { ServiceBroker } from 'moleculer';
import { BothelpService, CoreService, EmailService, SendpulseService, SmsService, WebService } from './services';

const broker = new ServiceBroker({
   logger: false,
});

broker.createService(SendpulseService);
broker.createService(EmailService);
broker.createService(BothelpService);
broker.createService(SmsService);
broker.createService(CoreService);

if (process.env.NODE_ENV !== 'production') {
   broker.createService(WebService);
}

broker.start()
   .then(() => console.info(
      'try to follow http://localhost:3000/core/registration?email=test%40test.test&phone=89509501234&firstname=Andrey&lastname=Sakharov',
   ));