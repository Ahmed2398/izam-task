<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Email;
use Illuminate\Validation\Rules\Password;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureEnvironment();
        $this->configureValidationRules();
        JsonResource::withoutWrapping();
        URL::forceHttps();
    }

    protected function configureValidationRules(): void
    {
        Email::defaults(function (): ?Email {
            if (app()->runningUnitTests() || app()->isLocal()) {
                return null;
            }

            return Rule::email()
                ->strict()
                ->validateMxRecord()
                ->preventSpoofing();
        });

        Password::defaults(function (): ?Password {
            if (app()->runningUnitTests() || app()->isLocal()) {
                return null;
            }

            return Password::min(8)->uncompromised();
        });
    }

    protected function configureEnvironment(): void
    {
        Model::shouldBeStrict(App::isLocal());
        DB::prohibitDestructiveCommands(App::isProduction());
        Vite::prefetch(concurrency: 3);
    }
}
