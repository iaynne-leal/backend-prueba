import { response, request } from "express";
import { Op, Sequelize } from "sequelize";
import { Agency } from "../models/Agency.js";
import { db } from "../src/database/connection.js";
import { Schedule } from "../models/Schedule.js";

const agencyGet = async (req = request, res = response) => {
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
    let agency = await Agency.findAll({
      limit: size,
      offset: size * (page - 1),

      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
      attributes: ["id", "name", "address", "township", "phone"],
    });

    agency = await Promise.all(
      agency.map(async (a) => ({ ...a, schedules: await a.getSchedules() }))
    );

    const count = await Agency.count({
      where: {
        id: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    res.json({
      agency,
      cantidad: count,
      totalPaginas: Math.ceil(count / size),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error no controlado" });
  }
};

const agencyPost = async (req, res = response) => {
  //const body = req.body;
  const { name, address, township, scheduleId, phone } = req.body;

  try {
    const agency = await db.transaction(async (t) => {
    /*   const _schedule = await Schedule.findByPk(scheduleId); */
      const _agency = await Agency.create(
        { name, address, township, scheduleId, phone },
        {
          transaction: t,
        }
      );
      await _agency.setSchedules(scheduleId, { transaction: t });
    /*   await _schedule.addAgency(_agency.id, { transaction: t }); */
      return _agency;
    });

    res.json({
      msg: "agencia creada correctamente",
      agency,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo salió mal",
      error,
    });
  }
};

const agencyPut = async (req = request, res = response) => {
  const id = req.params.id;
  const { name, address, township, scheduleId, phone } = req.body;

  try {
    // Busca la agencia por su id
    let agency = await Agency.findByPk(id);

    if (!agency) {
      return res.status(404).json({
        msg: "No se encontró la agencia.",
      });
    }

    agency = await db.transaction(async (t) => {
      let _agency = await Agency.findByPk(id);
     /*  _agency.set({
        name,
        address,
        township,
        phone,
      }); */

      name &&  (_agency.name = name) 
      address && (_agency.address = address)
      township && (_agency.township = township)
      phone && (_agency.phone = phone)

      if (_agency.changed()) {
        await _agency.save();
      }
      if (scheduleId) {
        await _agency.setSchedules(scheduleId, { transaction: t });
      }
      return _agency;
    });
    // Actualiza la información de la agencia con el método update
    res.json({
      msg: "agencia actualizado",
      agency,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar actualizar a la agencia.",
      error,
    });
  }
};

const agencyDelete = async (req, res = response) => {
  const id = req.params.id;
  try {
    const agency = await Agency.findByPk(id); // Busca la agencia por su id utilizando el método findByPk
    if (agency) {
      // Si se encontró la agencia, procede a eliminarlo.
      await agency.destroy(); // Utiliza el método destroy para eliminar la agencia de la base de datos.
      res.json({
        msg: "agencia eliminada con éxito.", // Si funciona, sale el mensaje
      });
    } else {
      res.status(404).json({
        msg: "No se encontró la agencia.",
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Ocurrió un error al intentar eliminar la agencia.",
      error,
    });
  }
};

export { agencyPost, agencyGet, agencyPut, agencyDelete };
