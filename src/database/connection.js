import { DataTypes, Sequelize } from "sequelize";
import "dotenv/config";
import { initAgency, initPhone, initUser, initSchedule } from "../../models/index.js";


// Creación de una nueva instancia de Sequelize para la conexión a la base de datos
const db = new Sequelize(process.env.BD, process.env.USER, process.env.PASS, {
  host: process.env.HOST,
  dialect: "mysql",
  /*  port: process.env.PORTA, */
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // }
  // logging: false;
});

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}


const Agency = initAgency(db , DataTypes)
const Phone = initPhone(db , DataTypes)
const User = initUser(db , DataTypes)
const Schedule = initSchedule(db , DataTypes)

Agency.hasMany(Phone)
Phone.belongsTo(Agency)
/* Agency.hasMany(Schedule) */
/* Schedule.hasMany(Agency) */
Agency.belongsToMany(Schedule,{through:'t_schedule_agency'})
Schedule.belongsToMany(Agency,{through:'t_schedule_agency'})

export {db , Agency, Phone, User, Schedule}