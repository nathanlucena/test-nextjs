// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

interface ErrorResponseType {
  error: string;
}

interface Locale {
  name_local: string;
  image: string;
  description: string;
  coordinates: number[];
  created_at: Date;
}

interface SuccessResponseType {
  _id: string;
  name: string;
  email: string;
  locales: Locale;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponseType | SuccessResponseType>
): Promise<void> => {
  if (req.method === 'POST') {
    const { name, email, locales } = req.body;
    if (
      !name ||
      !email ||
      !locales.name_local ||
      !locales.image ||
      !locales.description ||
      !locales.coordinates
    ) {
      res.status(400).json({ error: 'Tem algo faltando aí, meu chapa' });
      return;
    } else {
      const { db } = await connect();
      locales.created_at = new Date();
      const response = await db.collection('users').insertOne({
        name,
        email,
        locales,
      });

      res.status(200).json(response.ops[0]);
    }
  } else if (req.method === 'GET') {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'email não encontrado' });
      return;
    }

    const { db } = await connect();

    const response = await db.collection('users').findOne({ email });

    res.status(200).json(response);
  }
};
