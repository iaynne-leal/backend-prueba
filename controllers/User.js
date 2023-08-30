import { response, request } from "express";
import { Op } from "sequelize";
import { User } from "../src/database/connection.js";

const userGet = async (req = request, res = response) => {
  let { search, pagina = 1, limite = 5 } = req.query;

  const pageAsNumber = Number.parseInt(pagina);
  const limitAsNumber = Number.parseInt(limite);

  let page = 1;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
    page = pageAsNumber;
  }

  let size = 5;
  if (!Number.isNaN(limitAsNumber) && limitAsNumber > 0) {
    size = limitAsNumber;
  }

  if (search === undefined) {
    search = "";
  } else {
    search = search.trim();
  }

  try {
    const users = await User.findAll({
      limit: size,
      offset: size * (page - 1),

      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
      attributes: ["id", "name", "nameUser", "password"],
    });

    const count = await User.count({
      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    res.json({
      users,
      cantidad: count,
      totalPaginas: Math.ceil(count / size),
    });
  } catch (error) {
    res.status(500).json({ msg: "Error no controlado" });
  }
};

const userPost = async (req, res = response) => {
  //const body = req.body;
  const { name, nameUser, password } = req.body;

  try {
    const user = await User.create({
      name,
      nameUser,
      password,
    });

    res.json({
      msg: "usuario creado correctamente",
      user,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal xD",
      error,
    });
  }
};

const userPut = async (req = request, res = response) => {
  const id = req.params.id;
  const { name, nameUser, password } = req.body;

  try {
    // Busca el usuario por su id
    const users = await User.findByPk(id);
    console.log(req.params);
    if (!users) {
      return res.status(404).json({
        msg: "No se encontró el usuario.",
      });
    }

    // Actualiza la información del usuario con el método update
    const result = users.set({
      name,
      nameUser,
      password,
    });
    console.log(result);
    await users.save();
    res.json({
      msg: "usuario actualizado",
      users,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar actualizar el usuario.",
      error,
    });
  }
};

const userDelete = async (req, res = response) => {
  const id = req.params.id;
  try {
    const users = await User.findByPk(id); // Busca el usuario por su id utilizando el método findByPk
    if (users) {
      // Si se encontró el usuario, procede a eliminarlo.
      await users.destroy(); // Utiliza el método destroy para eliminar el usuario de la base de datos.
      res.json({
        msg: "usuario eliminado con éxito.", // Si funciona, sale el mensaje
      });
    } else {
      res.status(404).json({
        msg: "No se encontró el usuario.",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar eliminar el usuario.",
      error,
    });
  }
};

export { userGet, userPost, userPut, userDelete };
