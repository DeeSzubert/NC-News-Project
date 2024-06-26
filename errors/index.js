function handlePsqlErrors(error, request, response, next) {
  if (error.code === "22P02") {
    response.status(400).send({ message: "invalid id type" });
  } else if (error.code === "23503") {
    response.status(404).send({ message: "doesn't exists in database" });
  }
  next(error);
}

function handleCustomErrors(error, request, response, next) {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  }
  next(error);
}

function handleServerErrors(error, request, response, next) {
  response.status(500).send({ message: "internal server error" });
}

module.exports = {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
};
