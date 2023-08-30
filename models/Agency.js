import { Model } from "sequelize";

export class Agency extends Model {}

export default (db, DataTypes) => {
  Agency.init(
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

      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      township: {
        type: DataTypes.ENUM(
          "Cobán",
          "San Pedro Carchá",
          "San Juan Chamelco",
          "San Cristóbal Verapaz",
          "Tactic",
          "Tucuru",
          "Tamahú",
          "Panzós",
          "Senahú",
          "Cahabón",
          "Lanquín",
          "Chahal",
          "Fray Bartolomé de las Casas",
          "Chisec",
          "Santa Cruz Verapaz",
          "Santa Catalina La Tinta",
          "Raxruhá"
        ),
        allowNull: false,
      },

      phone: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

    },
    {
      sequelize: db,
      modelName: "agency",
      tableName: "t_agency",
      timestamps: true,
      paranoid: true,
    }
  );

  return Agency;
};
