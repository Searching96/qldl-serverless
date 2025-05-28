# Backend Services - Global Environment Configuration

This backend uses a **global .env configuration** for all serverless services to ensure consistency and easier management.

## 🔧 Global .env Configuration

All services now use the global `.env` file located at:
```
backend/.env
```

### Environment Variables:
```properties
AWS_REGION=ap-southeast-1
DB_REGION=us-east-1
DB_HOST=hqabt634kmgljyyqickjge7zs4.dsql.us-east-1.on.aws
DB_USER=admin
DB_NAME=postgres
DB_PORT=5432
```

## 🚀 Starting Services

### Method 1: NPM Scripts (Recommended)
```bash
# Start individual services
npm run start:dai-ly        # Port 8080 - Main API
npm run start:quan          # Port 4001 - Districts
npm run start:loai-dai-ly   # Port 4002 - Agent Types
npm run start:don-vi-tinh   # Port 4003 - Units
npm run start:id-tracker    # Port 4004 - ID Generation
npm run start:tham-so       # Port 4005 - Parameters

# Start all services at once
npm run start:all
```

### Method 2: PowerShell Scripts
```powershell
# Start all services
.\start-all-services.ps1

# Start individual service
.\start-service.ps1 -ServiceName "dai-ly"
```

### Method 3: Manual Start
```bash
cd src/dai-ly
serverless offline --httpPort 8080
```

## 📡 Service Endpoints

| Service | Port | Endpoint | Purpose |
|---------|------|----------|---------|
| **dai-ly** | 8080 | `http://localhost:8080` | Main agent management API |
| **quan** | 4001 | `http://localhost:4001` | District management |
| **loai-dai-ly** | 4002 | `http://localhost:4002` | Agent type management |
| **don-vi-tinh** | 4003 | `http://localhost:4003` | Unit management |
| **id-tracker** | 4004 | `http://localhost:4004` | ID generation service |
| **tham-so** | 4005 | `http://localhost:4005` | System parameters |

## 🏗️ Service Structure

Each service follows this structure:
```
src/{service-name}/
├── handler.mjs         # Lambda handlers
├── services.mjs        # Business logic
├── database.mjs        # Database connection
├── serverless.yml      # Service configuration
└── README.md          # Service documentation
```

## ⚙️ Configuration Details

### Global .env Integration
Each `serverless.yml` now includes:
```yaml
plugins:
  - serverless-dotenv-plugin
  - serverless-offline

custom:
  dotenv:
    path: ../../../.env  # Points to global .env file
  serverless-offline:
    httpPort: {unique_port}
```

### Benefits of Global .env:
- ✅ **Centralized configuration** - One place to manage all environment variables
- ✅ **Consistency** - All services use the same database connection
- ✅ **Easy deployment** - Single .env file for all services
- ✅ **Version control** - Simplified .gitignore management
- ✅ **Maintenance** - Update database credentials in one place

## 🔧 Development Workflow

1. **Set up environment variables** in `backend/.env`
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start required services**:
   ```bash
   npm run start:dai-ly  # For main development
   ```
4. **Start frontend** (in separate terminal):
   ```bash
   cd ../frontend
   npm start
   ```

## 🛠️ Troubleshooting

### Environment Variables Not Loading
- Ensure `serverless-dotenv-plugin` is installed
- Verify `.env` file path in `serverless.yml`
- Check `.env` file format (no quotes around values)

### Port Conflicts
- Each service uses a unique port
- Check if ports are available: `netstat -an | findstr :8080`
- Kill existing processes if needed

### Database Connection Issues
- Verify AWS credentials and permissions
- Check Aurora DSQL cluster status
- Ensure network connectivity to AWS

## 📝 Notes

- All services share the same Aurora DSQL database
- Environment variables are loaded at startup
- Services can be started independently
- Frontend expects dai-ly service on port 8080
