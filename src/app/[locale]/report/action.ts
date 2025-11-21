"use server";
import dbConnect from "@/lib/mongoose";
import ReportDoc from "@/models/ReportDoc";
import ReportUserDoc from "@/models/ReportUserDoc";
import { getUserInfo } from "@/lib/session";

export async function getReportDocData() {
  // const userInfo = await getUserInfo();
  // if (!userInfo || !userInfo.userId) return;

  await dbConnect();const twData = await ReportDoc.findOne({ language: "tw" }).select("-__v");
  const zhData = await ReportDoc.findOne({ language: "zh" }).select("-__v");
  return {
    twData,
    zhData,
  };
}
export async function getUserReportDocData(locale: string) {
  const userInfo = await getUserInfo();
  if (!userInfo || !userInfo.userId) return;
  await dbConnect();
  const userDocData = await ReportUserDoc.findOne({
    language: locale == "zh-CN" ? "zh" : "tw",
    userId: userInfo.userId,
    isDelete: 0,
  }).select("-__v");

  return userDocData;
}
