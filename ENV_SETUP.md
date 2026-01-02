# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Port
PORT=8001

# MongoDB Connection String
# Format: mongodb://username:password@host:port/database
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
MONGO_URL=your_mongodb_connection_string_here

# JWT Secret Key (use a strong random string in production)
# Generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
secret=your_secret_key_here

# Node Environment (development or production)
NODE_ENV=development
```

## Generating a Strong Secret Key

To generate a secure random secret key, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Important Notes

- ⚠️ **NEVER commit the `.env` file to version control**
- The `.env` file is already in `.gitignore`
- Copy the values above and create your own `.env` file
- Use different secrets for development and production environments

