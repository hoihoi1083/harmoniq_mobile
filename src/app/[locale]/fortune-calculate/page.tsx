'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function FortuneCalculatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [selectedDate, setSelectedDate] = useState(24);

  // Extract locale from pathname
  const locale = pathname?.split('/')[1] || 'zh-TW';

  // Generate dates for the week (simplified)
  const dates = [21, 22, 23, 24, 25, 26, 27];
  const days = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Use standard Navbar */}
      <Navbar from="fortune-calculate" backgroundColor="white" />
      
      {/* Content with top padding for navbar */}
      <div className="pt-16" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))' }}>

      {/* Today's Luck Card */}
      <div className="mx-4 mt-4">
        <div className="bg-gradient-to-br from-[#B8D87A] to-[#9BC25C] rounded-3xl p-8 text-white">
          <p className="text-lg mb-2">今日運程</p>
          <p className="text-5xl font-bold">中吉</p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mx-4 mt-4 flex gap-2 overflow-x-auto">
        {dates.map((date, index) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center ${
              selectedDate === date
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <span className="text-xs mb-1">{days[index]}</span>
            <span className="text-lg font-medium">{date}</span>
          </button>
        ))}
      </div>

      {/* Theory and Tips Buttons */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <button 
          onClick={() => router.push(`/${locale}/home#theory`)}
          className="relative w-full overflow-hidden rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <Image 
            src="/images/fortune-calculate/theroy.png" 
            alt="原理"
            width={355}
            height={163}
            className="w-full h-auto object-contain"
          />
        </button>
        <button 
          onClick={() => router.push(`/${locale}/home`)}
          className="relative w-full overflow-hidden rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <Image 
            src="/images/fortune-calculate/tips.png" 
            alt="小貼士"
            width={355}
            height={163}
            className="w-full h-auto object-contain"
          />
        </button>
      </div>

      {/* Bazi Chart Button */}
      <div className="mx-4 mt-3">
        <button className="relative w-full rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <Image
            src="/images/fortune-calculate/bazi.png"
            alt="八字排盤"
            width={705}
            height={163}
            className="w-full h-auto object-contain"
          />
        </button>
      </div>

      {/* Reports Section */}
      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">付費測算報告</h2>
          <span className="bg-[#B8D87A] text-white text-xs px-3 py-1 rounded-full">查看價錢</span>
        </div>

        {/* Swipeable Cards */}
        <div className="relative mb-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {/* Wealth Card */}
            <div className="flex-shrink-0 snap-center">
              <Image
                src="/images/fortune-calculate/wealth.png"
                alt="財運流年測算"
                width={210}
                height={251}
                className="w-[140px] h-auto object-contain"
              />
            </div>

            {/* Relationship Card */}
            <div className="flex-shrink-0 snap-center">
              <Image
                src="/images/fortune-calculate/relationship.png"
                alt="感情流年測算"
                width={211}
                height={251}
                className="w-[140px] h-auto object-contain"
              />
            </div>

            {/* Couple Card */}
            <div className="flex-shrink-0 snap-center">
              <Image
                src="/images/fortune-calculate/couple.png"
                alt="感情合盤測算"
                width={210}
                height={251}
                className="w-[140px] h-auto object-contain"
              />
            </div>

            {/* Health Card */}
            <div className="flex-shrink-0 snap-center">
              <Image
                src="/images/fortune-calculate/health.png"
                alt="健康流年測算"
                width={211}
                height={251}
                className="w-[140px] h-auto object-contain"
              />
            </div>

            {/* Career Card */}
            <div className="flex-shrink-0 snap-center">
              <Image
                src="/images/fortune-calculate/career.png"
                alt="事業測算"
                width={244}
                height={284}
                className="w-[163px] h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Bottom Two Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="relative rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <Image
              src="/images/fortune-calculate/fengshui.png"
              alt="風水測算"
              width={355}
              height={351}
              className="w-full h-auto object-cover"
            />
          </button>

          <button className="relative rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <Image
              src="/images/fortune-calculate/life.png"
              alt="命理測算"
              width={355}
              height={351}
              className="w-full h-auto object-cover"
            />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
