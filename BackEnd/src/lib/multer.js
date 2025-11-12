import multer from 'multer'

const storage = multer.memoryStorage();
const limits = {
    fileSize: 3 * 1024 * 1024,
}

export const upload = multer({
  storage: storage,
  limits: limits,
});