export function genUnAuthData(msg?: string) {
  return { status: 401, message: msg || "Unauthorized" };
}

export function genSuccessData(data?: any) {
  const res: any = { status: 0 };
  if (data) res.data = data;
  return res;
}

export function genErrorData(msg?: string) {
  return { status: -1, message: msg || "server error" };
}
