module.exports = (app) => {
  app.use((req, res, next) => {
    // Page not available
    res.status(404).json({ errorMessage: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever a next(err) is called, this middleware will handle the error
    console.log("ERROR", req.method, req.path, err);

    // only render if the error occured before sending the response
    if (!res.headersSent) {
      res.status(500).json({
        errorMessage: "Internal server error. Check the server console.",
      });
    }
  });
};
