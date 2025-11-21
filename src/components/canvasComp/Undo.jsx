import {
    Undo2,
    Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
export default function Undo({ history, historyIndex, handleUndo, handleRedo, className }) {
    return <div className={cn("flex items-center gap-2", className)}>
        <button
            className={`p-1 rounded hover:bg-gray-100 ${historyIndex <= 0 ? "text-gray-300" : "text-gray-600"
                }`}
            onClick={handleUndo}
            disabled={historyIndex <= 0}
        >
            <Undo2 className="w-4 h-4" />
        </button>
        <button
            className={`p-1 rounded hover:bg-gray-100 ${historyIndex >= history.length - 1
                ? "text-gray-300"
                : "text-gray-600"
                }`}
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
        >
            <Redo2 className="w-4 h-4" />
        </button>
    </div>
}
