import { takeSound } from "@lunisolar/plugin-takesound";
import { char8ex } from "@lunisolar/plugin-char8ex";
import { theGods } from "@lunisolar/plugin-thegods";
import lunisolar from "lunisolar";
import moment from "moment";
import { astro } from "iztro";

lunisolar.extend(takeSound).extend(char8ex).extend(theGods);
export const currentLNGanzhi = getCurrentLNGanzhi();
export const {
	LYGanzhiMap,
	LYzhiMap,
	LYStarMap,
	LYSihuaMap,
	spouseStarMap,
	spouseSihuaMap,
} = getAllLYGanzhi();
export const currentLYGanzhi = getCurrentLYGanzhi();
export const spousePalace = getSpousePalace();
let wuxingCache = {};
/**
  加载takeSound插件后，
  SB对象（天干地支对象）会添加一个takeSound属性，
 */

export default function getWuxingData(birthDateTime, gender) {
	//先从缓存中取值
	let birthStr = moment(birthDateTime).format("YYYY-MM-DD HH:mm:ss");
	if (wuxingCache[birthStr + "-" + gender])
		return wuxingCache[birthStr + "-" + gender];

	//未命中缓存，重新计算
	const no = gender === "female" ? 0 : 1;

	let hour = moment(birthDateTime).hour();
	let hourIndex = Math.floor(hour / 2);
	let date = moment(birthDateTime).format("YYYY-MM-DD");

	const astrolabe = astro.bySolar(
		date,
		hourIndex,
		gender == "female" ? "女" : "男",
		true,
		"zh-CN"
	);
	// 获取命宫
	const mingPalace = astrolabe.palace("命宫");
	// 获取身宫
	const bodyPalace = astrolabe.palace("身宫");
	//const parentPalace = astrolabe.palace("父母");
	//迁移宫主星
	const qianyiPalace = astrolabe
		.palace("迁移")
		.majorStars.map((item) => item.name)
		.toString();
	//运限
	const horoscope = astrolabe.horoscope(date, hourIndex);

	const lsr = lunisolar(birthStr);

	// console.log('wuxing', lsr.char8.day.stem.e5.name)
	let wuxingScale = getWuxingScale(
		lsr.char8.year.stem.e5.name,
		lsr.char8.year.branch.e5.name,
		lsr.char8.month.stem.e5.name,
		lsr.char8.month.branch.e5.name,
		lsr.char8.day.stem.e5.name,
		lsr.char8.day.branch.e5.name,
		lsr.char8.hour.stem.e5.name,
		lsr.char8.hour.branch.e5.name
	);
	let rizhiCanggan = lsr.char8.day.branch.hiddenStems
		.map((item) => item.name)
		.toString(); // 取得日支的藏干

	// Get hidden stems for all branches
	const yearBranchHiddenStems = lsr.char8.year.branch.hiddenStems;
	const monthBranchHiddenStems = lsr.char8.month.branch.hiddenStems;
	const dayBranchHiddenStems = lsr.char8.day.branch.hiddenStems;
	const hourBranchHiddenStems = lsr.char8.hour.branch.hiddenStems;
	const c8 = lsr.char8ex(no);
	const yearPillar = c8.year;
	const monthPillar = c8.month;
	const dayPillar = c8.day;
	const hourPillar = c8.hour;

	const result = {
		nayin: lsr.char8.year.takeSound,
		wuxingJu: getWuxingJu(lsr.char8.year.takeSoundE5.toString()),
		year: lsr.char8.year.toString(),
		month: lsr.char8.month.toString(),
		day: lsr.char8.day.toString(),
		hour: lsr.char8.hour.toString(),
		wuxingScale,
		rizhiCanggan,
		mingPalace: `{主星：${mingPalace.majorStars.map((item) => item.name).toString()},主星亮度：${mingPalace.majorStars.map((item) => item.brightness || "").toString()}, 辅星： ${mingPalace.minorStars.map((item) => item.name).toString()}, 四化：${mingPalace
			.mutagedPlaces()
			.map((item) => item.name)
			.toString()}}`,
		bodyPalace: `{主星：${bodyPalace.majorStars.map((item) => item.name).toString()},主星亮度：${bodyPalace.majorStars.map((item) => item.brightness || "").toString()}, 辅星： ${bodyPalace.minorStars.map((item) => item.name).toString()}, 四化：${bodyPalace
			.mutagedPlaces()
			.map((item) => item.name)
			.toString()}}`,
		qianyiPalace,
		dayunGanzhi:
			horoscope.decadal.heavenlyStem + horoscope.decadal.earthlyBranch, //大运干支
		liunianGanzhi: currentLNGanzhi, //当前流年干支
		yearStemTenGod: yearPillar.stemTenGod.name, //年天干十神,
		yearBranchTenGod: yearPillar.branchTenGod
			.map((item) => item.name)
			.toString(), //年地支十神,
		monthStemTenGod: monthPillar.stemTenGod.name,
		monthBranchTenGod: monthPillar.branchTenGod
			.map((item) => item.name)
			.toString(),
		dayStemTenGod: dayPillar.stemTenGod.name,
		dayBranchTenGod: dayPillar.branchTenGod
			.map((item) => item.name)
			.toString(),
		hourStemTenGod: hourPillar.stemTenGod.name,
		hourBranchTenGod: hourPillar.branchTenGod
			.map((item) => item.name)
			.toString(),
		yearGods: yearPillar.gods.map((item) => item.name).toString(), //年柱神煞 父母
		monthGods: monthPillar.gods.map((item) => item.name).toString(), //月柱神煞 成长环境社交圈
		dayGods: dayPillar.gods.map((item) => item.name).toString(), //日柱神煞 个人的性格特征和主要运势

		// Add individual stem and branch wuxing data
		// 年柱
		yearStem: lsr.char8.year.stem.name,
		yearStemWuxing: lsr.char8.year.stem.e5.name,
		yearBranch: lsr.char8.year.branch.name,
		yearBranchWuxing: lsr.char8.year.branch.e5.name,

		// 月柱
		monthStem: lsr.char8.month.stem.name,
		monthStemWuxing: lsr.char8.month.stem.e5.name,
		monthBranch: lsr.char8.month.branch.name,
		monthBranchWuxing: lsr.char8.month.branch.e5.name,

		// 日柱 (日主最重要)
		dayStem: lsr.char8.day.stem.name, // 日主
		dayStemWuxing: lsr.char8.day.stem.e5.name, // 日主五行
		dayBranch: lsr.char8.day.branch.name,
		dayBranchWuxing: lsr.char8.day.branch.e5.name,

		// 時柱
		hourStem: lsr.char8.hour.stem.name,
		hourStemWuxing: lsr.char8.hour.stem.e5.name,
		hourBranch: lsr.char8.hour.branch.name,
		hourBranchWuxing: lsr.char8.hour.branch.e5.name,

		// 納音 for each pillar
		yearNayin: lsr.char8.year.takeSound, // 年柱納音
		monthNayin: lsr.char8.month.takeSound, // 月柱納音
		dayNayin: lsr.char8.day.takeSound, // 日柱納音
		hourNayin: lsr.char8.hour.takeSound, // 時柱納音

		// 納音五行 for each pillar
		yearNayinWuxing: lsr.char8.year.takeSoundE5.toString(), // 年柱納音五行
		monthNayinWuxing: lsr.char8.month.takeSoundE5.toString(), // 月柱納音五行
		dayNayinWuxing: lsr.char8.day.takeSoundE5.toString(), // 日柱納音五行
		hourNayinWuxing: lsr.char8.hour.takeSoundE5.toString(), // 時柱納音五行

		// Hidden stems (藏干) for comprehensive element analysis
		yearBranchHiddenStems: yearBranchHiddenStems.map((item) => ({
			stem: item.name,
			element: item.e5.name,
			strength: item.value, // Strength of hidden stem
		})),
		monthBranchHiddenStems: monthBranchHiddenStems.map((item) => ({
			stem: item.name,
			element: item.e5.name,
			strength: item.value,
		})),
		dayBranchHiddenStems: dayBranchHiddenStems.map((item) => ({
			stem: item.name,
			element: item.e5.name,
			strength: item.value,
		})),
		hourBranchHiddenStems: hourBranchHiddenStems.map((item) => ({
			stem: item.name,
			element: item.e5.name,
			strength: item.value,
		})),
	};
	wuxingCache[birthStr + "-" + gender] = result;
	console.log("result", result);
	return result;
}

//当年流年干支
export function getCurrentLNGanzhi() {
	//运限
	const lsr = lunisolar(moment().format("YYYY-MM-DD"));
	return lsr.char8.year.toString();
}

//当年1-12月流月干支。流月命宫主星
export function getAllLYGanzhi() {
	let year = moment().format("YYYY");

	let resultGanzhi = {},
		LYzhiMap = {},
		resultStar = {},
		sihua = {},
		spouseStar = {},
		spouseSihua = {};
	for (let i = 1; i <= 12; i++) {
		let j = i < 10 ? "0" + i : "" + i;
		const dateStr = year + "-" + j + "-15";
		//console.log('dateStr', dateStr)
		const astrolabe = astro.bySolar(dateStr, 0, "男", true, "zh-CN");
		const horoscope = astrolabe.horoscope(dateStr);
		LYzhiMap[i] = horoscope.monthly.earthlyBranch;
		resultGanzhi[i] =
			horoscope.monthly.heavenlyStem + horoscope.monthly.earthlyBranch;
		resultStar[i] = horoscope
			.palace("命宫", "monthly")
			.majorStars.map((item) => item.name)
			.toString();
		spouseStar[i] = horoscope
			.palace("夫妻", "monthly")
			.majorStars.map((item) => item.name)
			.toString();
		sihua[i] = horoscope
			.palace("命宫", "monthly")
			.mutagedPlaces()
			.map((item) => item.name)
			.toString();
		spouseSihua[i] = horoscope
			.palace("夫妻", "monthly")
			.mutagedPlaces()
			.map((item) => item.name)
			.toString();
		//const lsr = lunisolar(year + '-' + j + '-15');
		//result[i] = lsr.char8.month.toString();
	}
	//console.log('1-12月流月干支', resultGanzhi)
	return {
		LYGanzhiMap: resultGanzhi,
		LYzhiMap,
		LYStarMap: resultStar,
		LYSihuaMap: sihua,
		spouseStarMap: spouseStar,
		spouseSihuaMap: spouseSihua,
	};
}
//当前流月干支
export function getCurrentLYGanzhi() {
	let cur = moment().format("YYYY-MM-DD");
	const lsr = lunisolar(cur);
	return lsr.char8.month.toString();
}

//流年夫妻宫主星
export function getSpousePalace() {
	let date = moment().format("YYYY-MM-DD");
	const astrolabe = astro.bySolar(date, 0, "男", true, "zh-CN");
	const horoscope = astrolabe.horoscope(date, 0);
	//流年夫妻宫主星
	return horoscope
		.palace("夫妻", "yearly")
		.majorStars.map((item) => item.name)
		.toString();
}

function getWuxingScale(
	niangan,
	nianzhi,
	yuegan,
	yuezhi,
	rigan,
	rizhi,
	shigan,
	shizhi
) {
	const wuxingCount = {
		金: 0,
		木: 0,
		水: 0,
		火: 0,
		土: 0,
	};

	const parameters = [
		niangan,
		nianzhi,
		yuegan,
		yuezhi,
		rigan,
		rizhi,
		shigan,
		shizhi,
	];

	parameters.forEach((param) => {
		if (["金", "木", "水", "火", "土"].includes(param)) {
			wuxingCount[param]++;
		}
	});

	const totalCount = parameters.length;

	const result = `金:${((wuxingCount.金 / totalCount) * 100).toFixed(2)}%，木:${((wuxingCount.木 / totalCount) * 100).toFixed(2)}%，水:${((wuxingCount.水 / totalCount) * 100).toFixed(2)}%，火:${((wuxingCount.火 / totalCount) * 100).toFixed(2)}%，土:${((wuxingCount.土 / totalCount) * 100).toFixed(2)}%`;
	return result;
}
const wuxingMap = {
	水: "二",
	木: "三",
	金: "四",
	土: "五",
	火: "六",
};
function getWuxingJu(nayin) {
	return `${nayin}${wuxingMap[nayin]}局`;
}
//console.log(lsr.char8.year.takeSound)  // 金箔金 （取得年干支的纳音）
//lsr.char8.year.takeSoundE5.toString() // 金 （取得年干支的纳音五行）
// ...
//console.log(lsr.char8.day.takeSound) // 大海水 （取得日干支的纳音）
//lsr.takeSound // 大海水 （取得日干支的纳音 等同于 lsr.char8.day.takeSound）
