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
    // Decode the token without verifying to extract userId and salt
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.userId || !decoded.email) {
      return response.status(401).json({ message: 'Invalid token payload' });
    }

    // Retrieve the salt from your user record, based on userId
    const user = await UserModel.findById(decoded.userId);  // Adjust based on your data model
    if (!user) {
      return response.status(401).json({ message: 'User not found' });
    }

    const userSecret = generateUserSecret(process.env.BASE_JWT_SECRET, decoded.userId, user.salt);

    // Now verify the token with the user-specific secret
    jwt.verify(token, userSecret);

    // Attach user data to the request for further use
    request.user = decoded;

    next();
  } catch (error) {
    return response.status(403).json({ message: 'Invalid or expired token', error: error.message });
  }
}
