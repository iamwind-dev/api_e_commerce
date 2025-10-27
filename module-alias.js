const path = require("path");
const moduleAlias = require("module-alias");

const basePath = path.resolve(__dirname);

moduleAlias.addAliases({
  "@src": path.join(basePath, "src"),
  "@utils": path.join(basePath, "src/utils"),
  "@controllers": path.join(basePath, "src/controllers"),
  "@routes": path.join(basePath, "src/routes"),
  "@models": path.join(basePath, "src/models"),
  "@config": path.join(basePath, "src/config"),
  "@repositories": path.join(basePath, "src/repositories"),
});
