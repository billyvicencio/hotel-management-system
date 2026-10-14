<?php

namespace Database\Seeders;

use App\Models\HotelRoom;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach ([
            ['number' => '101', 'type' => 'Standard Single', 'rate' => 89, 'status' => 'Available', 'floor' => '1st floor', 'description' => 'A comfortable single room with everything you need for a restful stay.'],
            ['number' => '102', 'type' => 'Deluxe Double', 'rate' => 145, 'status' => 'Occupied', 'floor' => '1st floor', 'description' => 'A bright double room with a king bed and a quiet courtyard view.'],
            ['number' => '201', 'type' => 'Executive Suite', 'rate' => 240, 'status' => 'Available', 'floor' => '2nd floor', 'description' => 'A spacious suite with a separate lounge and city views.'],
            ['number' => '202', 'type' => 'Standard Single', 'rate' => 89, 'status' => 'Cleaning', 'floor' => '2nd floor', 'description' => 'A calm single room with a work desk and natural light.'],
            ['number' => '301', 'type' => 'Deluxe Double', 'rate' => 165, 'status' => 'Available', 'floor' => '3rd floor', 'description' => 'A roomy double with soft linens and a lovely morning view.'],
        ] as $room) {
            HotelRoom::updateOrCreate(['number' => $room['number']], $room);
        }
    }
}
