export async function authenticateJwt(request: any, response: any, next: any){
  const jwt = await (request.headers as any).authorization

  next()
}