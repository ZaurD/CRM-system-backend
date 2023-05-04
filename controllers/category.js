module.exports.getAll = function (req, res) {
  res.status(200).json({
    login: "from controller",
  });
};

module.exports.getById = function (req, res) {
  res.status(200).json({
    register: "from controller",
  });
};

module.exports.remove = function (req, res) {};

module.exports.create = function (req, res) {};

module.exports.update = function (req, res) {};
