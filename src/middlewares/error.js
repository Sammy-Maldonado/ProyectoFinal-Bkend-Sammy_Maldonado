const handleErrorResponse = (error, req, res) => {
  switch (error.status) {
    case 400:
      req.logger.http(error.message);
      res.status(error.status).send(error.message);
      break;

    case 403:
      req.logger.http(error.message);
      res.status(error.status).send(error.message);
      break;

    case 404:
      req.logger.http(error.message);
      res.status(error.status).send(error.message);
      break;

    case 500:
      req.logger.fatal(error.message);
      res.status(error.status).send("Error Interno del servidor");
      break;
    // Puedes agregar más casos según tus necesidades
    default:
      req.logger.error(error.message);
      res.status(error.status || 500).send("Error Interno del servidor");
  }
}

export default handleErrorResponse;