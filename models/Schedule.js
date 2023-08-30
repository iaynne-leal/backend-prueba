import { Model } from "sequelize";

export class Schedule extends Model {}

export default (db, DataTypes) => {
  Schedule.init(
    {
      // Definición de los campos del modelo
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      start: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      end: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize: db,
      modelName: "schedule",
      tableName: "t_schedule",
      timestamps: true,
      paranoid: true,
    }
  );

  return Schedule;
};
