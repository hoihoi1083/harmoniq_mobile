'use client'
import { useEffect, useState, useRef } from "react";
import { get, post, patch } from "@/lib/ajax";
import translate from "@/components/report/translate";
export default function useTranslate(paramTransStatus, mingLiData, liuNianData, jiajuProData, locale, userInfo, reportDocData) {
    //异步翻译另一种语言再存储。为了防止内容过长翻译失败，采取分批翻译，一起保存的处理
    const [transData1, setTransData1] = useState(null);
    const [transData2, setTransData2] = useState(null);
    const [transData3, setTransData3] = useState(null);
    const [finalStatus, setFinalStatus] = useState(false);
    //以下三个状态是翻译失败后重新翻译使用。
    const [lastFailFlag, setLastFailFlag] = useState(false);
    const [newReportDocData, setNewReportDocData] = useState({});

    //reportDocData是用来判断翻译失败的情况的，要重新翻译。正常情况下不会触发
    useEffect(() => {
        const load = async (userId) => {//先查另外一种语言的报告
            const lang = locale === 'zh-CN' ? 'tw' : 'zh';
            const targetLang = locale === 'zh-CN' ? 'zh' : 'tw';
            const { status, data } = await get(`/api/reportUserDoc/${userId}/${lang}`)
            if (status == 0 && data) {
                console.log('已有另一种语言报告')
                //找到了用户已有报告
                const { data: data1, status: status1 } = await translate(data.mingLiData, targetLang);

                const { data: data2, status: status2 } = await translate(data.liuNianData, targetLang, true);

                const { data: data3, status: status3 } = await translate(data.jiajuProData, targetLang);

                if (status1 == 0 && status2 == 0 && status3 == 0) {
                    const { status: _status } = await patch(`/api/reportUserDoc/${userId}/${targetLang}`, { mingLiData: JSON.parse(data1), liuNianData: JSON.parse(data2), jiajuProData: JSON.parse(data3) });
                    if (_status == 0) {
                        setFinalStatus(false);
                        setLastFailFlag(false);
                        setNewReportDocData({ ...data, mingLiData: data1, liuNianData: data2, jiajuProData: data3 })
                    }
                }

            }


        }
        if (reportDocData && userInfo && userInfo.isLock == false && userInfo.genStatus == 'done') {
            const { mingLiData, liuNianData, jiajuProData } = reportDocData;
            if (!mingLiData || !liuNianData || !jiajuProData) {
                setFinalStatus(true);
                setLastFailFlag(true);
                //已经成功生成过报告了，但是reportDocData没有对应语言的进阶数据，说明上一次翻译失败了，这次重新翻译
                load(userInfo.userId);
            }


        }
    }, [userInfo, reportDocData, locale])

    //以下代码是生成进阶报告后，需要正常翻译的逻辑。
    useEffect(() => {
        setFinalStatus(paramTransStatus);
    }, [paramTransStatus])

    useEffect(() => {
        const load = async () => {
            console.log('翻译命理进阶')
            setFinalStatus(true);
            const { data, status } = await translate(mingLiData, locale === 'zh-CN' ? 'tw' : 'zh');
            if (status == 0) {
                setTransData1(JSON.parse(data));
            }
        }
        if (mingLiData && locale) {
            load()
        }
    }, [mingLiData, locale])

    useEffect(() => {
        const load = async () => {
            console.log('翻译流年进阶')
            setFinalStatus(true);
            const { data, status } = await translate(liuNianData, locale === 'zh-CN' ? 'tw' : 'zh');
            if (status == 0) {
                setTransData2(JSON.parse(data));
            }
        }
        if (liuNianData && locale) {
            load()
        }
    }, [liuNianData, locale])

    useEffect(() => {
        const load = async () => {
            console.log('翻译家居进阶')
            setFinalStatus(true);
            const { data, status } = await translate(jiajuProData, locale === 'zh-CN' ? 'tw' : 'zh');
            if (status == 0) {
                setTransData3(JSON.parse(data));
            }
        }
        if (jiajuProData && locale) {
            load()
        }
    }, [jiajuProData, locale])

    useEffect(() => {
        const load = async (userId) => {
            const { status } = await patch(`/api/reportUserDoc/${userId}/${locale == 'zh-CN' ? 'tw' : 'zh'}`, { mingLiData: transData1, liuNianData: transData2, jiajuProData: transData3 });
            if (status == 0) {
                setFinalStatus(false);
            }
        }
        if (transData1 && transData2 && transData3 && userInfo?.userId && locale) {
            load(userInfo?.userId);
        }
    }, [transData1, transData2, transData3, userInfo?.userId, locale])


    return { transStatus: finalStatus, lastFailFlag, newReportDocData }
}

