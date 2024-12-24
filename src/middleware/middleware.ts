import jwt from 'jsonwebtoken';
import generateUserSecret from '../scripts/generateUserSecret';
import UserModel from '../models/users_model/users';

export async function authenticateJwt(request: any, response: any, next: any) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ message: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json({ message: 'Token is missing from Authorization header' });
  }

  try {
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.userId || !decoded.email) {
      return response.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return response.status(401).json({ message: 'User not found' });
    }

    const userSecret = generateUserSecret(process.env.BASE_JWT_SECRET, user._id, user.salt);

    console.log("36", jwt.verify(token, userSecret));
    console.log({token, userSecret})

    request.user = decoded;

    next();
  } catch (error) {
    return response.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
}
