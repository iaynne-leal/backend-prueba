import { Model } from "sequelize";

export class Phone extends Model {}

export default (db, DataTypes) => {
  Phone.init(
    {
      // Definición de los campos del modelo
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: db,
      modelName: "phone",
      tableName: "t_phone",
      timestamps: true,
      paranoid: true,
    }
  );

  return Phone;
};
