const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.blue('\n🚀 YouTube Shorts Automation Setup\n'));

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  console.log(chalk.yellow('Creating .env file from .env.example...'));
  fs.copyFileSync(envExamplePath, envPath);
  console.log(chalk.green('✓ .env file created'));
  console.log(chalk.cyan('Please configure your environment variables in .env'));
} else {
  console.log(chalk.green('✓ .env file already exists'));
}

// Create required directories
const directories = [
  'output',
  'temp',
  'logs',
  'automation/database',
  'processed',
  'watch'
];

console.log(chalk.yellow('\nCreating required directories...'));
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(chalk.green(`✓ Created ${dir}/`));
  } else {
    console.log(chalk.blue(`✓ ${dir}/ already exists`));
  }
});

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 14) {
  console.log(chalk.red(`\n⚠️  Node.js ${nodeVersion} detected. Please use Node.js 14 or higher.`));
} else {
  console.log(chalk.green(`\n✓ Node.js ${nodeVersion} detected`));
}

// Check if Redis is available
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

console.log(chalk.yellow('\nChecking Redis connection...'));
client.on('error', (err) => {
  console.log(chalk.red('✗ Redis is not running'));
  console.log(chalk.yellow('\nTo install Redis:'));
  console.log(chalk.cyan('  Docker:  docker run -d -p 6379:6379 redis'));
  console.log(chalk.cyan('  Mac:     brew install redis'));
  console.log(chalk.cyan('  Ubuntu:  sudo apt-get install redis-server'));
  console.log(chalk.cyan('  Windows: Use WSL or Docker'));
  client.quit();
  process.exit(0);
});

client.on('connect', () => {
  console.log(chalk.green('✓ Redis is running'));
  client.quit();
  
  console.log(chalk.bold.green('\n✅ Setup completed successfully!\n'));
  console.log(chalk.cyan('Next steps:'));
  console.log(chalk.white('1. Configure your .env file with your settings'));
  console.log(chalk.white('2. Start the automation server: npm run automation:start'));
  console.log(chalk.white('3. Use the CLI tool: npm run automation:cli --help'));
  console.log(chalk.white('4. View the API documentation: http://localhost:3000/api-docs'));
  
  console.log(chalk.bold.blue('\n📚 Documentation:'));
  console.log(chalk.white('- AUTOMATION_README.md - Full automation documentation'));
  console.log(chalk.white('- YOUTUBE_SHORTS_GUIDE.md - YouTube Shorts creation guide'));
  console.log(chalk.white('- automation/examples/ - Example scripts and workflows'));
  
  console.log(chalk.bold.green('\n🎬 Happy automating!\n'));
});