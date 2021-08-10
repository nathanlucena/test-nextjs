// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ObjectId } from 'bson';
import { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/database';

interface ErrorResponseType {
  error: string;
}

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
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      res.status(400).json({ error: 'Missing e-mail on request body' });
      return;
    }

    const { db } = await connect();

    const response = await db.collection('users').findOne({ email });

    if (!response) {
      res.status(400).json({ error: `User with e-mail ${email} not found` });
      return;
    }

    res.status(200).json(response);
  }
};
