// import {Sequelize} from 'sequelize';
// import databaseConfig from '../config/database.js';
import {productionDbConfig, localDbConfig} from '../config/tsDbConfig';
import Application from './application';
import Contact from './contact';
import Address from './address';
import Issue from './issue';
import Measure from './measure';
import Species from './species';
import Activity from './activity';

const Sequelize = require('sequelize');

let envProd: boolean = false;

if (process.env.NODE_ENV === 'production') {
  envProd = true;
}

// const databaseConfig =  {
//   database: {
//     dialect: 'sqlite',
//     storage: './.development.db',
//     logging: false,
//   }
// }

let sequelize = new Sequelize(localDbConfig.database);

// const databaseConfig = require('../config/database.js').database;
if (envProd) {
  sequelize = new Sequelize(productionDbConfig.database);
}

const database = {
  sequelize,
  Application: Application(sequelize),
  Contact: Contact(sequelize),
  Address: Address(sequelize),
  Issue: Issue(sequelize),
  Measure: Measure(sequelize),
  Species: Species(sequelize),
  Activity: Activity(sequelize),
};

// Relationships go here.
database.Application.belongsTo(database.Contact, {foreignKey: 'LicenceHolderId'});
database.Application.belongsTo(database.Contact, {foreignKey: 'LicenceApplicantId'});
database.Application.belongsTo(database.Address, {foreignKey: 'LicenceHolderAddressId'});
database.Application.belongsTo(database.Address, {foreignKey: 'SiteAddressId'});
database.Application.belongsTo(database.Species, {foreignKey: 'SpeciesId'});

database.Issue.belongsTo(database.Application, {foreignKey: 'ApplicationId'});
database.Measure.belongsTo(database.Application, {foreignKey: 'ApplicationId'});

database.Contact.hasOne(database.Application);
database.Address.hasOne(database.Application);
database.Application.hasOne(database.Issue);
database.Application.hasOne(database.Measure);
database.Species.hasOne(database.Application);

database.Species.belongsTo(database.Activity, {as: 'HerringGull'});
database.Species.belongsTo(database.Activity, {as: 'BlackHeadedGull'});
database.Species.belongsTo(database.Activity, {as: 'CommonGull'});
database.Species.belongsTo(database.Activity, {as: 'GreatBlackBackedGull'});
database.Species.belongsTo(database.Activity, {as: 'LesserBlackBackedGull'});
database.Activity.hasMany(database.Species);



export {database as default};
