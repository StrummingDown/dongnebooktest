import e from "express";
import express from "express";
import client from "../client";
import { userFinder, userNickFinder, verify } from "../token/verify";

export const postChatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { token, writer } = req.body;
    const { id } = req.params; // 게시글 id
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const data = verify(token);
    const userInfo = await userFinder(data["email"]);
    const otherInfo = await userNickFinder(writer);

    const isFind = await client.chatroom.findMany({
      where: {
        productId: Number(id),
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
    });

    if (isFind.length !== 0) {
      return res.status(201).json({ message: "채팅방이 이미 존재합니다", isFind, state: true });
    }

    await client.chatroom.create({
      data: {
        users: {
          create: [
            {
              users: {
                connect: {
                  id: userInfo.id,
                },
              },
            },
            {
              users: {
                connect: {
                  id: otherInfo.id,
                },
              },
            },
          ],
        },
        productId: Number(id),
      },
    });
    console.log("create%%");
    return res.status(201).json({ message: "챗룸생성 완료", state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const getchatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const data = verify(String(token));
    const userInfo = await userFinder(data["email"]);

    const chat = await client.chatroom.findMany({
      where: {
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
      include: {
        chats: {
          where: {
            userId: {
              not: userInfo.id,
            },
            read: false,
          },
        },
      },
    });

    const chatroom = await client.chatroom.findMany({
      where: {
        users: {
          some: {
            userId: userInfo.id,
          },
        },
      },
      include: {
        users: {
          include: {
            users: true,
          },
        },
        chats: {
          orderBy: {
            id: "desc",
          },
        },
        product: true,
      },
    });

    chatroom.forEach((el, idx) => {
      el["count"] = chat[idx].chats.length;
    });

    return res
      .status(200)
      .json({ message: "채팅방 조회 완료", id: userInfo.id, chatroom, state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const postChat = async (req: express.Request, res: express.Response) => {
  try {
    const { content, token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const { id } = req.params; //채팅방 id

    const userInfo = verify(token);
    console.log("@@@@@@@@");
    console.log(userInfo);
    await client.chat.create({
      data: {
        userId: userInfo["id"],
        content,
        chatroomId: Number(id),
      },
    });

    return res.status(201).json({ message: "채팅내역 생성 완료", state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};

export const enterChatroom = async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: "로그인이 필요한 서비스입니다.", state: false });
    }
    const { id } = req.params; //채팅방 id

    const userInfo = verify(String(token));
    console.log("userInfo");
    console.log(userInfo);
    await client.chatroom.update({
      where: {
        id: Number(id),
      },
      data: {
        chats: {
          updateMany: {
            where: {
              userId: {
                not: userInfo["id"],
              },
            },
            data: {
              read: true,
            },
          },
        },
      },
    });
    return res.status(200).json({ message: "채팅방 입장 완료", state: true });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "마이그레이션 또는 서버 오류입니다." });
  }
};