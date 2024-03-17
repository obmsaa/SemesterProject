
import jwt from "jsonwebtoken";


export function giveToken(userId){
    console.log("user id in token: ", userId)
    try{
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ userId }, secret, { expiresIn: '2h' });
    return token;
    } catch (error){
        console.error('Failed to generate token:', error);

        throw new Error('Failed to generate token.');
    }
}

export function verifyToken(token){
    
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;


        const decoded = jwt.verify(token, secret); 
        const userID = decoded.userId; 
        return userID;

    } catch (error) {
        console.error('Error decoding JWT:', error);
        throw new Error('Invalid or expired token. Please log in again.');        

    }
}