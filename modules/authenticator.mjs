
import jwt from "jsonwebtoken";


export function giveToken(userId){
    console.log("user id in token: ", userId)
    try{
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ userId }, secret, { expiresIn: '2h' });
    return token;
    } catch (error){
        throw new Error('Failed to generate token:', error);
    }
}

export function verifyToken(token){
    
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;


        const decoded = jwt.verify(token, secret); 
        const userId = decoded.userId; // Access the user ID from the decoded payload
        return {userAuthenticated: true, userId};

    } catch (error) {
        // Handle errors, such as invalid token or signature
        console.log('Error decoding JWT:', error);
        return {userAuthenticated: false};

    }
}