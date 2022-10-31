import db from "../utils/db";

export const createUser = async (email: string, name: string): Promise<any> => {
  return await db.user.upsert({
    where: {
      email: email,
    },
    update: {},
    create: {
      email: email,
      name: name,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<any> => {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};
