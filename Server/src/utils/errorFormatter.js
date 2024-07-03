const errorFormatter = (errors) => {
  const error = [];
  const field = [];
  errors.forEach((element) => {
    if (!field.includes(element.path)) {
      error.push({
        field: element.path,
        value: element.value,
        message: element.msg,
        in: element.location,
      });
      field.push(element.path);
    }
  });
  return error;
};

module.exports = errorFormatter;
