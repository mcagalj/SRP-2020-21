module.exports = ({ app }) => {
  app.get("/", (req, res) => res.json({ message: "Hello there!" }));
};
