const User = require('./User');
const File = require('./File');
const Folder = require('./Folder');
const Tag = require('./Tag');
const Comment = require('./Comment');
const Permission = require('./Permission');
const Activity = require('./Activity');
const Program = require('./Program');

// ===== RELACIONES =====

// User - File
User.hasMany(File, { foreignKey: 'uploadedBy', as: 'files' });
File.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// User - Folder
User.hasMany(Folder, { foreignKey: 'ownerId', as: 'folders' });
Folder.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Program - Folder (CAMBIAR 'program' a 'programData')
Program.hasMany(Folder, { foreignKey: 'programId', as: 'folders' });
Folder.belongsTo(Program, { foreignKey: 'programId', as: 'programData' });

// Program - File (CAMBIAR 'program' a 'programData')
Program.hasMany(File, { foreignKey: 'programId', as: 'files' });
File.belongsTo(Program, { foreignKey: 'programId', as: 'programData' });

// Folder - File
Folder.hasMany(File, { foreignKey: 'folderId', as: 'files' });
File.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });

// File - Tag (Many to Many)
File.belongsToMany(Tag, { through: 'FileTags', as: 'tags' });
Tag.belongsToMany(File, { through: 'FileTags', as: 'files' });

// User - Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// File - Comment
File.hasMany(Comment, { foreignKey: 'fileId', as: 'comments' });
Comment.belongsTo(File, { foreignKey: 'fileId', as: 'file' });

// User - Permission
User.hasMany(Permission, { foreignKey: 'userId', as: 'permissions' });
Permission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Permission, { foreignKey: 'grantedBy', as: 'grantedPermissions' });
Permission.belongsTo(User, { foreignKey: 'grantedBy', as: 'grantor' });

// User - Activity
User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  File,
  Folder,
  Tag,
  Comment,
  Permission,
  Activity,
  Program
};