import { post } from '@/lib/ajax';
export default async function translate(jsonData, lang, isArray) {
    let fix = isArray ? '原内容是一个数组格式的数据，请翻译后返回全部数组，不要遗漏数组中的项' : '';
    let jsonStr = JSON.stringify(jsonData);
    const result = await post('/api/generateCode',
        {
            user: jsonStr,
            system: `请将用户提供给你的json格式中的中文文字内容翻译成${lang === 'zh' ? '简体中文' : '繁体中文'},保持原有格式返回，不要增加或删减字符。` + fix + `
            示例JSON格式：${jsonStr}
            `,
            jsonResult: true,
            assistant: jsonStr
        })
    return result;
}