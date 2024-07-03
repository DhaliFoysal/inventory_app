const db = require("../../../db/db");

const deleteUserById = async (userId) => {
  try {
    const userQueryText = `DELETE FROM user WHERE id=${userId}`;
    const [rows] = await db.query(userQueryText);

    const user = rows;
    console.log(user);

    if (rows.affectedRows) {
      return {
        companyId: user.companyId,
        role: user.role,
        status: user.status,
      };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error);
  }
};
