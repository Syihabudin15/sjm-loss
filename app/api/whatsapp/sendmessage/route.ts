import {
  DroppingMessage,
  ProsesMessage,
} from "@/components/utils/messageUtils";
import { IDapem, IDropping } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { sendWaNotification } from "@/libs/whatsapp";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { id, isfor, ids } = await req.json();
  let messages = "";

  if (!id && !ids) {
    return NextResponse.json(
      { status: 400, msg: "ID data wajib diisi." },
      { status: 400 },
    );
  }

  if (ids) {
    return NextResponse.json(
      {
        status: 403,
        msg: "Pengiriman Notif dengan banyak data masih dalam tahap pengembangan!",
      },
      { status: 403 },
    );
  } else {
    if (isfor === "DROPPING") {
      const find = await prisma.dropping.findFirst({
        where: id,
        select: {
          id: true,
          Dapems: {
            select: {
              id: true,
              Debitur: { select: { fullname: true } },
              plafond: true,
              c_provisi_sumdan: true,
              c_adm_sumdan: true,
              c_account_sumdan: true,
            },
          },
        },
      });
      if (!find) {
        return NextResponse.json(
          { status: 404, msg: "Data pencairan tidak ditemukan." },
          { status: 404 },
        );
      }
      messages = DroppingMessage(find as IDropping);
    } else {
      const find = await prisma.dapem.findFirst({
        where: { id },
        select: {
          id: true,
          plafond: true,
          tenor: true,
          c_takeover: true,
          takeover_from: true,
          JenisPembiayaan: { select: { name: true } },
          ProdukPembiayaan: { select: { name: true } },
          Debitur: { select: { fullname: true } },
        },
      });
      if (!find) {
        return NextResponse.json(
          { status: 404, msg: "Data pengajuan tidak ditemukan." },
          { status: 404 },
        );
      }
      messages = ProsesMessage(find as IDapem, isfor || "SLIK");
    }
  }

  const sent = await sendWaNotification(messages);
  if (!sent) {
    return NextResponse.json(
      { status: 502, msg: "Notifikasi gagal dikirim ke WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { status: 200, msg: "Notifikasi berhasil dikirim." },
    { status: 200 },
  );
};
