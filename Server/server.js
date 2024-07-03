require("dotenv").config();
const app = require("./app/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server Run ${PORT}`);
});
