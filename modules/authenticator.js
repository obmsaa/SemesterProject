
import jwt from "jsonwebtoken";


export function giveToken(userId){

    try{
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const token = jwt.sign({ userId }, secret, { expiresIn: '2h' });
    return {authenticated: true, token};
    } catch (error){
        console.log('Error in signing a token', error);
        return {authenticated: false};
    }
}

export function verifyToken(token){
    
    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;


        const decoded = jwt.verify(token, secret); 
        const userId = decoded.userId; // Access the user ID from the decoded payload
        return {authenticated: true, userId};

    } catch (error) {
        // Handle errors, such as invalid token or signature
        console.log('Error decoding JWT:', error);
        return {authenticated: false};

    }
}