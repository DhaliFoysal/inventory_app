const { getData } = require("./healthService");

const checkHealth = async (_req, res, next) => {
  try {
    const data = await getData();
    res.status(200).json({ code: 200, message: data.message, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkHealth,
};