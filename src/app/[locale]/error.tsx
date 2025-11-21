// frontend/src/app/error.tsx

"use client"; // 错误组件必须是客户端组件

import { useEffect } from "react";

export default function Error({ error }: { error: never }) {
	useEffect(() => {
		// 将错误记录到错误报告服务
	}, [error]);

	return (
		<div>
			<h2>出了些问题！</h2>
			{/* <p>根错误：{error}</p> */}
			{/* <button
        onClick={
          // 尝试通过重新渲染该部分来恢复
          () => reset()
        }
      >
        再试一次
      </button>*/}
		</div>
	);
}
