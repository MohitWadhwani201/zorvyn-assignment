const { Record } = require("../models");

exports.summary = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === "viewer") {
      where.userId = req.user.id;
    }

    const income = await Record.sum("amount", {
      where: { ...where, type: "income" }
    });

    const expense = await Record.sum("amount", {
      where: { ...where, type: "expense" }
    });

    res.json({
      totalIncome: income || 0,
      totalExpense: expense || 0,
      netBalance: (income || 0) - (expense || 0)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const { fn, col } = require("sequelize");

exports.categoryTotals = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === "viewer") {
      where.userId = req.user.id;
    }

    const data = await Record.findAll({
      attributes: [
        "category",
        [fn("SUM", col("amount")), "total"]
      ],
      where,
      group: ["category"]
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.monthlyTrends = async (req, res) => {
  try {
    let where = {};

    if (req.user.role === "viewer") {
      where.userId = req.user.id;
    }

    const data = await Record.findAll({
      attributes: [
        [fn("strftime", "%Y-%m", col("date")), "month"],
        [fn("SUM", col("amount")), "total"]
      ],
      where,
      group: ["month"],
      order: [["month", "ASC"]]
    });

    res.json({ success: true, data });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};