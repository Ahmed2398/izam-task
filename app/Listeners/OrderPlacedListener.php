<?php

namespace App\Listeners;

use App\Events\OrderPlacedEvent;

class OrderPlacedListener
{
    /**
     * Handle the event.
     */
    public function handle(OrderPlacedEvent $event): void
    {
        info('Order placed: '.$event->order->id);
    }
}
