#!/usr/bin/env node

const { program } = require('commander');
const axios = require('axios');
const Table = require('cli-table3');
const chalk = require('chalk');
const ora = require('ora');

const API_URL = process.env.AUTOMATION_API_URL || 'http://localhost:3000/api';

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

// Helper function to display errors
const handleError = (error) => {
  console.error(chalk.red('Error:'), error.response?.data?.error || error.message);
  process.exit(1);
};

program
  .name('youtube-shorts-automation')
  .description('CLI tool for YouTube Shorts automation')
  .version('1.0.0');

// Job commands
program
  .command('job:create')
  .description('Create a new render job')
  .requiredOption('-c, --composition <id>', 'Composition ID')
  .requiredOption('-u, --url <url>', 'YouTube video URL')
  .option('-s, --start <seconds>', 'Start time in seconds', '0')
  .option('-e, --end <seconds>', 'End time in seconds', '30')
  .option('-l, --layout <type>', 'Layout type (vertical/horizontal/overlay/video-only)', 'vertical')
  .option('-t, --title <text>', 'Title text')
  .option('-p, --priority <number>', 'Job priority (1-10)', '5')
  .action(async (options) => {
    const spinner = ora('Creating job...').start();
    
    try {
      const response = await axios.post(`${API_URL}/jobs`, {
        compositionId: options.composition,
        props: {
          videoUrl: options.url,
          startTime: parseInt(options.start),
          endTime: parseInt(options.end),
          layout: options.layout,
          titleText: options.title || `YouTube Short - ${new Date().toISOString()}`
        },
        priority: parseInt(options.priority)
      });
      
      spinner.succeed(chalk.green('Job created successfully!'));
      console.log(chalk.cyan('Job ID:'), response.data.jobId);
      console.log(chalk.cyan('Output:'), response.data.outputPath);
    } catch (error) {
      spinner.fail();
      handleError(error);
    }
  });

program
  .command('job:status <jobId>')
  .description('Get job status')
  .action(async (jobId) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${jobId}`);
      const job = response.data;
      
      console.log(chalk.bold('\nJob Details:'));
      console.log(chalk.cyan('ID:'), job.job_id);
      console.log(chalk.cyan('Status:'), 
        job.status === 'completed' ? chalk.green(job.status) :
        job.status === 'failed' ? chalk.red(job.status) :
        chalk.yellow(job.status)
      );
      console.log(chalk.cyan('Composition:'), job.composition_id);
      console.log(chalk.cyan('Created:'), formatDate(job.created_at));
      console.log(chalk.cyan('Started:'), formatDate(job.started_at));
      console.log(chalk.cyan('Completed:'), formatDate(job.completed_at));
      
      if (job.output_path) {
        console.log(chalk.cyan('Output:'), job.output_path);
      }
      
      if (job.error_message) {
        console.log(chalk.red('Error:'), job.error_message);
      }
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('job:cancel <jobId>')
  .description('Cancel a job')
  .action(async (jobId) => {
    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`);
      console.log(chalk.green('✓'), 'Job cancelled successfully');
    } catch (error) {
      handleError(error);
    }
  });

// Schedule commands
program
  .command('schedule:create')
  .description('Create a new schedule')
  .requiredOption('-n, --name <name>', 'Schedule name')
  .requiredOption('-c, --cron <expression>', 'Cron expression')
  .requiredOption('-i, --composition <id>', 'Composition ID')
  .requiredOption('-u, --url <url>', 'YouTube video URL template')
  .option('-l, --layout <type>', 'Layout type', 'vertical')
  .action(async (options) => {
    const spinner = ora('Creating schedule...').start();
    
    try {
      const response = await axios.post(`${API_URL}/schedules`, {
        name: options.name,
        cronExpression: options.cron,
        compositionId: options.composition,
        propsTemplate: {
          videoUrl: options.url,
          startTime: 0,
          endTime: 30,
          layout: options.layout,
          titleText: `${options.name} - {{date}}`
        }
      });
      
      spinner.succeed(chalk.green('Schedule created successfully!'));
      console.log(chalk.cyan('Schedule ID:'), response.data.scheduleId);
    } catch (error) {
      spinner.fail();
      handleError(error);
    }
  });

program
  .command('schedule:list')
  .description('List all schedules')
  .action(async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      const schedules = response.data;
      
      if (schedules.length === 0) {
        console.log(chalk.yellow('No schedules found'));
        return;
      }
      
      const table = new Table({
        head: ['ID', 'Name', 'Cron', 'Enabled', 'Last Run', 'Next Run'],
        style: { head: ['cyan'] }
      });
      
      schedules.forEach(schedule => {
        table.push([
          schedule.schedule_id.substring(0, 8),
          schedule.name,
          schedule.cron_expression,
          schedule.enabled ? chalk.green('Yes') : chalk.red('No'),
          formatDate(schedule.last_run),
          formatDate(schedule.next_run)
        ]);
      });
      
      console.log(table.toString());
    } catch (error) {
      handleError(error);
    }
  });

program
  .command('schedule:toggle <scheduleId>')
  .description('Enable/disable a schedule')
  .action(async (scheduleId) => {
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      const schedule = response.data.find(s => s.schedule_id === scheduleId);
      
      if (!schedule) {
        console.error(chalk.red('Schedule not found'));
        return;
      }
      
      await axios.put(`${API_URL}/schedules/${scheduleId}`, {
        enabled: !schedule.enabled
      });
      
      console.log(chalk.green('✓'), `Schedule ${schedule.enabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      handleError(error);
    }
  });

// Queue commands
program
  .command('queue:status')
  .description('Get queue status')
  .action(async () => {
    try {
      const response = await axios.get(`${API_URL}/queue/status`);
      const status = response.data;
      
      console.log(chalk.bold('\nQueue Status:'));
      console.log(chalk.cyan('Waiting:'), status.waiting);
      console.log(chalk.cyan('Active:'), chalk.yellow(status.active));
      console.log(chalk.cyan('Completed:'), chalk.green(status.completed));
      console.log(chalk.cyan('Failed:'), chalk.red(status.failed));
      console.log(chalk.cyan('Delayed:'), status.delayed);
      console.log(chalk.cyan('Total:'), status.total);
    } catch (error) {
      handleError(error);
    }
  });

// Stats command
program
  .command('stats')
  .description('Get job statistics')
  .option('-d, --days <number>', 'Number of days', '7')
  .action(async (options) => {
    try {
      const response = await axios.get(`${API_URL}/stats?days=${options.days}`);
      const stats = response.data;
      
      console.log(chalk.bold(`\nStatistics (Last ${options.days} days):`));
      console.log(chalk.cyan('Total Jobs:'), stats.total_jobs);
      console.log(chalk.cyan('Successful:'), chalk.green(stats.successful_jobs));
      console.log(chalk.cyan('Failed:'), chalk.red(stats.failed_jobs));
      console.log(chalk.cyan('Success Rate:'), 
        stats.total_jobs > 0 
          ? `${((stats.successful_jobs / stats.total_jobs) * 100).toFixed(1)}%`
          : 'N/A'
      );
      console.log(chalk.cyan('Avg Render Time:'), 
        stats.avg_render_time 
          ? `${(stats.avg_render_time / 1000).toFixed(1)}s`
          : 'N/A'
      );
      console.log(chalk.cyan('Total Output Size:'), 
        stats.total_file_size 
          ? `${(stats.total_file_size / (1024 * 1024)).toFixed(1)} MB`
          : 'N/A'
      );
    } catch (error) {
      handleError(error);
    }
  });

// Batch processing command
program
  .command('batch:youtube')
  .description('Process multiple clips from a YouTube video')
  .requiredOption('-u, --url <url>', 'YouTube video URL')
  .requiredOption('-c, --clips <json>', 'Clips JSON array (e.g., \'[{"start":0,"end":30,"title":"Intro"}]\')')
  .option('-l, --layout <type>', 'Layout type', 'vertical')
  .action(async (options) => {
    const spinner = ora('Processing batch...').start();
    
    try {
      const clips = JSON.parse(options.clips).map(clip => ({
        startTime: clip.start,
        endTime: clip.end,
        title: clip.title
      }));
      
      const response = await axios.post(`${API_URL}/youtube/process`, {
        videoUrl: options.url,
        clips: clips,
        layout: options.layout,
        visualizer: true,
        captions: true
      });
      
      spinner.succeed(chalk.green('Batch processing started!'));
      console.log(response.data.message);
      
      response.data.jobs.forEach(job => {
        console.log(chalk.cyan('Job ID:'), job.jobId);
      });
    } catch (error) {
      spinner.fail();
      handleError(error);
    }
  });

program.parse(process.argv);