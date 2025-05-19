<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Console\Isolatable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

use function Laravel\Prompts\info;
use function Laravel\Prompts\text;
use function Laravel\Prompts\warning;

final class InstallAppCommand extends Command implements Isolatable
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install and set up the application.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        app()->detectEnvironment(fn (): string => 'local');

        info('Starting application installation...');

        $this->installNodeDependencies();
        $this->configureEnvironment();
        $this->reloadEnvironment();
        $this->generateAppKey();
        $this->prepareDatabase();
        $this->runPostSetupTasks();
        $this->updateProjectSettings();

        info('🎉 Application installation completed successfully!');
        info('🚀 Start your development server:');
        info('   • Run `composer run dev` for run development server');

        info('🔑 Default credentials:');
        info('   • Email: test@example.com');
        info('   • Password: password');
    }

    /**
     * Install Node.js dependencies if not already installed.
     */
    protected function installNodeDependencies(): void
    {
        if (! File::exists('node_modules')) {
            info('Installing Node.js dependencies...');
            Process::run('npm install');
        } else {
            warning('Node modules already installed. Skipping installation.');
        }
    }

    /**
     * Configure the application environment file.
     */
    protected function configureEnvironment(): void
    {
        info('Configuring the environment file...');

        if (! File::exists('.env')) {
            File::copy('.env.example', '.env');
            info('Environment file created.');
        } else {
            warning('Environment file already exists. Skipping creation.');
        }

        $this->updateEnvVariable('APP_ENV', 'local');
    }

    /**
     * Reload the application environment variables.
     */
    protected function reloadEnvironment(): void
    {
        app()->bootstrapWith([
            \Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
        ]);
    }

    /**
     * Generate an application key if not already set.
     */
    protected function generateAppKey(): void
    {
        info('Checking for application key...');
        if (empty(env('APP_KEY'))) {
            $this->call('key:generate');
        } else {
            warning('Application key already exists.');
        }
    }

    /**
     * Prepare the database for the application.
     */
    protected function prepareDatabase(): void
    {
        info('Creating database file...');

        if (! $exists = File::exists('database/database.sqlite')) {
            touch('database/database.sqlite');
        }

        info('Running database migrations...');
        if ($exists) {
            $this->call('migrate:fresh', ['--force' => true]);
        } else {
            $this->call('migrate', ['--force' => true]);
        }

        info('Seeding database...');
        $this->call('db:seed', ['--force' => true]);
    }

    /**
     * Run post-setup tasks such as linking storage and clearing cache.
     */
    protected function runPostSetupTasks(): void
    {
        $this->callSilent('storage:link');
        $this->callSilent('optimize:clear');
    }

    /**
     * Update project settings such as name and URL.
     */
    protected function updateProjectSettings(): void
    {
        $this->updateEnvVariable('APP_NAME', 'Task');

        $projectUrl = text(
            'Enter your project URL:',
            default: 'http://localhost:8000',
            required: true,
        );
        $this->updateEnvVariable('APP_URL', $projectUrl);
    }

    /**
     * Update a specific environment variable in the .env file.
     */
    protected function updateEnvVariable(string $key, string $value): void
    {
        $envPath = base_path('.env');
        if (File::exists($envPath)) {
            file_put_contents($envPath, preg_replace(
                "/^{$key}=.*/m",
                "{$key}=\"{$value}\"",
                file_get_contents($envPath)
            ));
        }
    }
}
