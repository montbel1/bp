# Backend Testing Guide

This guide covers comprehensive testing for PostgreSQL and Supabase backend integration in the Avanee Business Suite.

## 🎯 Overview

The testing suite provides comprehensive coverage for:

- **Database Connections**: PostgreSQL and Supabase connectivity
- **CRUD Operations**: Create, Read, Update, Delete operations
- **API Endpoints**: All backend API functionality
- **Relationships**: Database relationships and joins
- **Complex Queries**: Advanced database operations

## 🚀 Quick Start

### 1. Web Dashboard Testing

Visit the test dashboard at: `http://localhost:3000/test-dashboard`

### 2. Command Line Testing

```bash
# Run all tests
npm run test:all

# Run only database tests
npm run test:database

# Run only API tests
npm run test:api

# Run specific test types
npm run test
```

### 3. API Endpoint Testing

```bash
# Test database connections
curl http://localhost:3000/api/test-db

# Test specific database operations
curl http://localhost:3000/api/test-db?type=connection
curl http://localhost:3000/api/test-db?type=tables
curl http://localhost:3000/api/test-db?type=crud
curl http://localhost:3000/api/test-db?type=advanced

# Test API endpoints
curl http://localhost:3000/api/test-api
curl http://localhost:3000/api/test-api?type=core
curl http://localhost:3000/api/test-api?type=management
curl http://localhost:3000/api/test-api?type=features
curl http://localhost:3000/api/test-api?type=advanced
```

## 📊 Test Categories

### Database Tests (`/api/test-db`)

#### Connection Tests

- **Supabase Connection**: Tests Supabase client connectivity
- **PostgreSQL Connection**: Tests direct PostgreSQL pool connectivity
- **Connection Performance**: Measures response times

#### Table Existence Tests

- **Core Tables**: users, accounts, customers, invoices, transactions, categories
- **Table Accessibility**: Verifies table permissions and structure
- **Schema Validation**: Ensures proper table structure

#### CRUD Operation Tests

- **Create Operations**: Tests record insertion
- **Read Operations**: Tests data retrieval
- **Update Operations**: Tests record modification
- **Delete Operations**: Tests record removal
- **Data Integrity**: Ensures operations complete successfully

#### Advanced Query Tests

- **Relationship Queries**: Tests foreign key relationships
- **Complex Joins**: Tests multi-table queries
- **Aggregation Queries**: Tests grouping and calculations
- **Performance Metrics**: Measures query execution times

### API Tests (`/api/test-api`)

#### Core Business Logic

- **Accounts API**: `/api/accounts` (GET, POST)
- **Customers API**: `/api/customers` (GET, POST)
- **Transactions API**: `/api/transactions` (GET, POST)

#### Financial Operations

- **Invoices API**: `/api/invoices` (GET, POST)
- **Payments API**: `/api/payments` (GET, POST)
- **Bills API**: `/api/bills` (GET, POST)

#### Management Systems

- **Clients API**: `/api/clients` (GET, POST)
- **Vendors API**: `/api/vendors` (GET, POST)
- **Projects API**: `/api/projects` (GET, POST)

#### Supporting Features

- **Categories API**: `/api/categories` (GET, POST)
- **Calendar API**: `/api/calendar` (GET, POST)
- **Reports API**: `/api/reports` (GET)

#### Advanced Features

- **Blockchain API**: `/api/blockchain/*`
- **IoT API**: `/api/iot/*`
- **Flow API**: `/api/flow/*`
- **TaxPro API**: `/api/taxpro`

## 🔧 Test Configuration

### Environment Variables

```bash
# Test base URL (default: http://localhost:3000)
TEST_BASE_URL=http://localhost:3000

# Database connection (from .env.local)
DATABASE_URL=postgresql://username:password@AvaneeBP:5432/BP
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Test Data

The testing suite uses mock data for testing:

- **Test Users**: Sample user accounts
- **Test Customers**: Sample customer records
- **Test Categories**: Sample category data
- **Test Transactions**: Sample financial transactions

## 📈 Test Results

### Success Metrics

- **Connection Success Rate**: 100% for database connections
- **CRUD Success Rate**: 100% for basic operations
- **API Success Rate**: 95%+ for endpoint functionality
- **Performance**: < 500ms average response time

### Test Reports

- **Console Output**: Real-time test results
- **JSON Reports**: Detailed results saved to `test-results-*.json`
- **Web Dashboard**: Visual test results with charts and metrics

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Failures

```bash
# Check PostgreSQL connection
psql -h AvaneeBP -U username -d BP

# Check Supabase connection
curl https://your-project.supabase.co/rest/v1/
```

#### API Endpoint Failures

```bash
# Check server status
curl http://localhost:3000/api/health

# Check specific endpoint
curl http://localhost:3000/api/accounts
```

#### Test Script Issues

```bash
# Install dependencies
npm install

# Check Node.js version
node --version

# Run with verbose output
DEBUG=* npm run test:all
```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment variable
export DEBUG=*

# Run tests with debug output
npm run test:all
```

## 🔄 Continuous Testing

### Automated Testing

```bash
# Run tests on every build
npm run build && npm run test:all

# Run tests in CI/CD pipeline
npm run test:all -- --ci
```

### Scheduled Testing

```bash
# Daily database health check
0 2 * * * cd /path/to/project && npm run test:database

# Weekly full test suite
0 3 * * 0 cd /path/to/project && npm run test:all
```

## 📋 Test Maintenance

### Adding New Tests

1. **Database Tests**: Add to `src/lib/test-utils.ts`
2. **API Tests**: Add to `src/lib/api-test-utils.ts`
3. **Test Endpoints**: Add to `/api/test-*` routes
4. **Test Dashboard**: Update `/test-dashboard` page

### Updating Test Data

1. **Sample Data**: Update test data in test utilities
2. **Mock Responses**: Update mock data for offline testing
3. **Test Cases**: Add new test scenarios

### Performance Monitoring

- **Response Times**: Monitor API response times
- **Database Performance**: Track query execution times
- **Error Rates**: Monitor test failure rates
- **Resource Usage**: Track memory and CPU usage

## 🎯 Best Practices

### Test Design

- **Isolation**: Each test should be independent
- **Cleanup**: Clean up test data after each test
- **Mocking**: Use mock data for external dependencies
- **Validation**: Validate both success and failure cases

### Test Execution

- **Parallel Execution**: Run independent tests in parallel
- **Timeout Handling**: Set appropriate timeouts for long-running tests
- **Error Handling**: Gracefully handle test failures
- **Reporting**: Provide clear, actionable test reports

### Test Data Management

- **Test Databases**: Use separate test databases
- **Data Isolation**: Ensure test data doesn't affect production
- **Data Cleanup**: Automatically clean up test data
- **Data Seeding**: Use consistent test data across environments

## 📞 Support

For testing issues or questions:

1. Check the troubleshooting section above
2. Review test logs and error messages
3. Verify environment configuration
4. Check database connectivity
5. Ensure all dependencies are installed

## 🔗 Related Documentation

- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Environment Configuration](./ENV_VARIABLES.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
