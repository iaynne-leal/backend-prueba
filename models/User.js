import { Model } from "sequelize";

export class User extends Model {}

export default (db, DataTypes) => {
  User.init(
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

      nameUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: db,
      modelName: "user",
      tableName: "t_user",
      timestamps: true,
      paranoid: true,
    }
  );

  return User;
};
