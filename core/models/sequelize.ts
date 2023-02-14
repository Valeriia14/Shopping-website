import sequelize from "sequelize";

/**
 * Doing re-exports the sequelize because ESM import 
 * doesn't support named imports from sequelize CJS modules
 */
export const Model = sequelize.Model;
export const Op = sequelize.Op;
export const UniqueConstraintError = sequelize.UniqueConstraintError;