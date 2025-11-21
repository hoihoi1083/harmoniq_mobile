'use client'
import { Menu } from 'lucide-react';
import { useState } from 'react'
import { cn } from '@/lib/utils';

import MenuContent from './MenuContent';
export default function MenuBar({ className }) {
    const [isOpen, setIsOpen] = useState(false);

    const onMenuClick = () => {
        setIsOpen(true)
    }
    return <div>
        <Menu className={cn("w-4 h-4", className)} onClick={onMenuClick} />
        <MenuContent isOpen={isOpen} setIsOpen={setIsOpen} />

    </div>

}