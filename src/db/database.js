import Sequelize from "sequelize";
import 'dotenv/config'


const sequelize = new Sequelize(process.env.DATABASE, {
  dialect: 'postgres',
  logging: false
});

async function dbfiles(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export { sequelize };
export default dbfiles;
