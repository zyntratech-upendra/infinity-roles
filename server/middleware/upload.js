const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const createStorage = (folder = 'staffhub') => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder,
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf', 'webp'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: createStorage('employees') });
const companyUpload = multer({ storage: createStorage('companies') });

module.exports = upload;
module.exports.upload = upload;
module.exports.companyUpload = companyUpload;
