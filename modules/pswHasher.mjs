import crypto from 'crypto';


// Read the secret key from environment variable
const secretKey = process.env.SECRET_KEY;

// Function for hashing a password before storing it in the database
function hash(password) {
    if (typeof password === 'string' && password.length > 0 && secretKey) {
        const hash = crypto.createHmac('sha256', secretKey)
            .update(password)
            .digest('hex');
        return hash;
    } else {
        throw new Error('Invalid password or secret key');
    }
}

export default hash;