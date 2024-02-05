import { diskStorage } from 'multer';
import * as path from 'path';

const multerConfig = {
  storage: diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('dist/src/public'));
    },
    filename: (req, file, cb) => {
      cb(null, `${file.originalname}`);
    },
  }),
};

export default multerConfig;
