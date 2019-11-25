
import * as mongoose from 'mongoose';
import * as appConstants from '../../common/constants';

export const databaseProviders = [
  {
    provide: appConstants.DB_CONNECTION_TOKEN,
    useFactory: async (): Promise<typeof mongoose> => mongoose.connect(appConstants.DB_URI,{
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }),
  },
];
