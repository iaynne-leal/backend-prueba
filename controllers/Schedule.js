import { response, request } from "express";
import { Op } from "sequelize";
import { Schedule } from "../models/Schedule.js";

const scheduleGet = async (req = request, res = response) => {
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
    const _schedule = await Schedule.findAll({
      limit: size,
      offset: size * (page - 1),

      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
      attributes: ["id", "name", "start", "end"],
    });

    const count = await Schedule.count({
      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    res.json({
      schedule: _schedule,
      cantidad: count,
      totalPaginas: Math.ceil(count / size),
    });
  } catch (error) {
    res.status(500).json({ msg: "Error no controlado" });
  }
};

const schedulePost = async (req, res = response) => {
  //const body = req.body;
  const { name, start, end } = req.body;

  try {
    const _schedule = await Schedule.create({
        name, start, end
    });

    res.json({
      msg: "horario creado correctamente",
      schedule: _schedule,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Algo salió mal",
      error,
    });
  }
};

const schedulePut = async (req = request, res = response) => {
  const id = req.params.id;
  const {  name, start, end } = req.body;

  try {
    // Busca el horario por su id
    const _schedule = await Schedule.findByPk(id);

    if (!_schedule) {
      return res.status(404).json({
        msg: "No se encontró el horario.",
      });
    }

    // Actualiza la información del horario con el método update
    
    _schedule.set({
        name, start, end
    });
    await _schedule.save();

    res.json({
      msg: "horario actualizado",
      schedule: _schedule,
      
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar actualizar el horario.",
      error,
    });
  }
};

const scheduleDelete = async (req, res = response) => {
  const id = req.params.id;
  try {
    const _schedule = await Schedule.findByPk(id); // Busca el horario por su id utilizando el método findByPk
    if (_schedule) {
      // Si se encontró el horario, procede a eliminarlo.
      await _schedule.destroy(); // Utiliza el método destroy para eliminar el horario de la base de datos.
      res.json({
        msg: "horario eliminado con éxito.", // Si funciona, sale el mensaje
      });
    } else {
      res.status(404).json({
        msg: "No se encontró el horario.",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar eliminar el horario.",
      error,
    });
  }
};

export { scheduleGet, schedulePost, schedulePut, scheduleDelete};
