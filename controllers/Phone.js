import { response, request } from "express";
import { Op } from "sequelize";
import { Phone } from "../models/Phone.js";

const phoneGet = async (req = request, res = response) => {
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
    const phone = await Phone.findAll({
      limit: size,
      offset: size * (page - 1),

      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
      attributes: ["id", "phone"],
    });

    const count = await Phone.count({
      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    res.json({
      phone,
      cantidad: count,
      totalPaginas: Math.ceil(count / size),
    });
  } catch (error) {
    res.status(500).json({ msg: "Error no controlado" });
  }
};

const phonePost = async (req, res = response) => {
  //const body = req.body;
  const { phone } = req.body;

  try {
    const _phone = await Phone.create({
      phone,
    });

    res.json({
      msg: "telefono creado correctamente",
      phone: _phone,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal",
      error,
    });
  }
};

const phonePut = async (req = request, res = response) => {
  const id = req.params.id;
  const { phone } = req.body;

  try {
    // Busca el telefono por su id
    const _phone = await Phone.findByPk(id);

    if (!_phone) {
      return res.status(404).json({
        msg: "No se encontró el telefono.",
      });
    }

    // Actualiza la información del telefono con el método update
    
    _phone.set({
      phone,
    });
    await _phone.save();

    res.json({
      msg: "telefono actualizado",
      phone: _phone,
      
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar actualizar el telefono.",
      error,
    });
  }
};

const phoneDelete = async (req, res = response) => {
  const id = req.params.id;
  try {
    const phone = await Phone.findByPk(id); // Busca el telefono por su id utilizando el método findByPk
    if (phone) {
      // Si se encontró el telefono, procede a eliminarlo.
      await phone.destroy(); // Utiliza el método destroy para eliminar el telefono de la base de datos.
      res.json({
        msg: "telefono eliminado con éxito.", // Si funciona, sale el mensaje
      });
    } else {
      res.status(404).json({
        msg: "No se encontró el telefono.",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar eliminar el telefono.",
      error,
    });
  }
};

export { phoneGet, phonePost, phonePut, phoneDelete };
