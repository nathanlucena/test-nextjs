// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/database';

interface ErrorResponseType {
  error: string;
}

// interface Locale {
//   name_local: string;
//   image: string;
//   description: string;
//   coordinates: number[];
//   created_at: Date;
// }

interface SuccessResponseType {
  _id: ObjectId;
  name: string;
  email: string;
  locales: {
    name_local: string;
    image: string;
    description: string;
    coordinates: number[];
    created_at: Date;
  };
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
      res.status(400).json({ error: 'Tem algo faltando aí, meu chapaa' });
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
    const { db } = await connect();

    const response: SuccessResponseType = await db
      .collection('users')
      .find({})
      .toArray();
    res.status(200).json(response);
  } else if (req.method === 'PUT') {
    const { email, locales } = req.body;

    if (
      !email ||
      !locales.name_local ||
      !locales.image ||
      !locales.coordinates
    ) {
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
      .collection('users')
      .updateOne(
        { email: email },
        { $set: { locales: newLocale, upsert: true } }
      );

    res.status(200).json(locales);
  } else if (req.method === 'DELETE') {
    const { email } = req.body;
    const { db } = await connect();

    await db.collection('users').deleteOne({ email: email });

    res.status(200).json(email);
  }
};
