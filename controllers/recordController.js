const { Record } = require("../models");
const { Op } = require("sequelize");
const checkOwnership = (record, user) => {
  if (user.role === "admin") return true;
  return record.userId === user.id;
};
exports.create = async (req, res) => {
  try {
    // console.log("USER:", req.user);
    // console.log("BODY:", req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Invalid user in token" });
    }

    const { amount, type, category, date, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: record
    });

  } catch (err) {
    console.error("CREATE ERROR FULL:", err); // 👈 THIS will reveal truth
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let { page = 1, limit = 10, type, category, startDate, endDate } = req.query;

    page = parseInt(page);
    limit = Math.min(parseInt(limit), 50); // ✅ prevent abuse

    const offset = (page - 1) * limit;

    let where = {};

    // 🔐 Role-based data scoping
    if (req.user.role === "viewer") {
      where.userId = req.user.id;
    }

    if (type) where.type = type;
    if (category) where.category = category;

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const data = await Record.findAndCountAll({
      where,
      limit,
      offset,
      order: [["date", "DESC"]]
    });

    res.json({
      success: true,
      total: data.count,
      page,
      totalPages: Math.ceil(data.count / limit),
      data: data.rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });

    if (!checkOwnership(record, req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await record.update(req.body);

    res.json({ success: true, data: record });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.remove = async (req, res) => {
  try {
    const record = await Record.findByPk(req.params.id);

    if (!record) return res.status(404).json({ message: "Record not found" });

    if (!checkOwnership(record, req.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await record.destroy();

    res.json({ success: true, message: "Record deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};