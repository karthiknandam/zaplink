import { prisma } from "../db";
import { linkType } from "../validation/link.schema";
import { generateCode } from "../utils/generateCode.ts";

type returnType = { data: linkType | null; success: boolean };

export const insertUrl = async (url: string): Promise<returnType> => {
  try {
    const code = generateCode();

    const isExists = await prisma.link.findUnique({
      where: {
        code,
      },
    });

    if (isExists) {
      return { success: false, data: null }; // return to the frontend with the error code and get new code
    }

    const link = await prisma.link.create({
      data: {
        code: code,
        url,
      },
    });

    return {
      data: link as linkType,
      success: true,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getLinks = async (): Promise<linkType[] | null> => {
  try {
    // const data = await prisma.link.findMany({
    //   take: number (10 pagination),
    // });

    const data = await prisma.link.findMany();

    // if(data.length > 0) // this should done for 10M AU
    return data as linkType[];
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getLink = async (code: string): Promise<returnType> => {
  try {
    /**
     * Find and give it to user
     */

    const link = await prisma.link.findUnique({
      where: {
        code,
      },
    });

    if (!link) {
      return {
        success: false,
        data: null,
      };
    }

    return {
      success: true,
      data: link as linkType,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};

export const deleteLink = async (
  code: string
): Promise<{ success: boolean }> => {
  try {
    /**
     * Fetch and delete link
     */

    const isPresent = await prisma.link.findUnique({
      where: {
        code,
      },
    });

    if (!isPresent) {
      return {
        success: false,
      };
    }

    /**
     * Deleting the section with id is more cheap in database cost than code
     */

    await prisma.link.delete({
      where: {
        id: isPresent.id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};
