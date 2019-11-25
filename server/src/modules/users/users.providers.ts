
import { Connection } from 'mongoose';
import { UserSchema } from './schemas/schema';
import * as appConstants from '../../common/constants';

export const usersProviders = [
  {
    provide: appConstants.USER_MODEL_TOKEN,
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: [appConstants.DB_CONNECTION_TOKEN],
  },
];
