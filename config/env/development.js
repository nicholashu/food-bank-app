'use strict';

module.exports = {
	db: process.env.MONGO_DEV_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/fb-dev',
};
