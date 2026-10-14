<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelRoom extends Model
{
    protected $fillable = ['number', 'type', 'rate', 'status', 'floor', 'description'];

    protected function casts(): array
    {
        return ['rate' => 'decimal:2'];
    }
}
