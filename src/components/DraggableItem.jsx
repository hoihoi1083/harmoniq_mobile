"use client";
import { useDraggable } from "@dnd-kit/core";

export function DraggableItem({ id, type, data, children, isOverCanvas }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
			data: {
				type,
				...data,
			},
		});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
				opacity:
					isDragging && !isOverCanvas
						? 0.5
						: isDragging && isOverCanvas
							? 0
							: 1,
				position: "relative",
				zIndex: isDragging ? 1000 : 1,
				visibility: "visible",
				// touchAction: 'none'
			}
		: {};
	// , touchAction: 'none'
	return (
		<div className="relative z-0 w-22.5">
			<div className="absolute  -z-1 w-22.5 top-0 left-0">{children}</div>
			<div
				ref={setNodeRef}
				// style={style}
				{...listeners}
				{...attributes}
				className="cursor-move"
				style={{ ...style }}
			>
				{children}
			</div>

			{/* {isDragging && (
        <div className="fixed px-4 py-2 -translate-x-1/2 bg-white rounded-full shadow-lg top-4 left-1/2">
          {children}
        </div>
      )} */}
		</div>
	);
}
