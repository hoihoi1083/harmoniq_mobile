'use client';
import { Link } from '@/i18n/navigation';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import emitter from '@/lib/emitter';
import { EVENT_TRANSLATE_STATUS } from '@/types/constants'
import { useTranslations } from "next-intl";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function LanguageToggle({ className, trigger }) {
  const pathname = usePathname();
  let href = `/${pathname.split('/').slice(2).join('/')}`;
  // const [transStatus, setTransStatus] = useState(false)
  const t = useTranslations('toast');
  // useEffect(() => {
  //   function load(transStatus) {  //     setTransStatus(transStatus)
  //   }
  //   emitter.on(EVENT_TRANSLATE_STATUS, load)
  //   return () => {
  //     emitter.off(EVENT_TRANSLATE_STATUS, load)
  //   }
  // }, [])
  // const onToggle = e => {
  //   if (pathname.indexOf('report') > -1 && transStatus) {
  //     e.preventDefault();
  //     toast.info(t('translating'));
  //   }
  // }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn("cursor-pointer flex items-center space-x-1 text-white hover:opacity-80", className)}>
        <div>{
          trigger ? trigger : pathname.startsWith('/zh-CN') ? '简体中文' : '繁體中文'
        } <ChevronDownIcon className="w-4 h-4" /></div>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-lg shadow-lg p-1 min-w-[120px]">
        <DropdownMenuItem className="focus:bg-inherit">
          <Link
            // onClick={onToggle}
            href={href}
            locale="zh-CN"
            className="px-4 py-2 text-sm  hover:text-primary rounded text-foreground"
          >
            简体中文
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-inherit">
          <Link

            // onClick={onToggle}
            href={href}
            locale="zh-TW"
            className="px-4 py-2 text-sm hover:text-primary rounded text-foreground"
          >
            繁體中文
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>

    </DropdownMenu>
  )

}