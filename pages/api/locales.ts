// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ObjectID } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
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
    const { _id, locales } = req.body;

    if (!_id || !locales) {
      res.status(400).json({ error: 'Missing parameter on request body' });
      return;
    }

    const { db } = await connect();

    const newLocale = {
      name_local: locales.name_local,
      image: locales.image,
      description: locales.description,
      coordinates: locales.coordinates,
      created_at: new Date(),
    };

    await db
      .collection('locales')
      .updateOne({ _id: _id }, { $push: { locales: newLocale } });

    res.status(200).json(locales);
  }
};
