import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
  fileFilter: (req, file, cb) => {

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload an Excel (.xlsx) file.'), false);
    }
  },
});

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  const { polesCost, mvCablesCost, lvCablesCost, transformersCost, dropCablesCost } = req.body;

  res.status(200).json({
    data: 'Upload successful',
    fields: {
      polesCost,
      mvCablesCost,
      lvCablesCost,
      transformersCost,
      dropCablesCost,
    },
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
