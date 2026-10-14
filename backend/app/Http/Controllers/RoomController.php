<?php

namespace App\Http\Controllers;

use App\Models\HotelRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => HotelRoom::query()->orderBy('number')->get()]);
    }

    public function show(HotelRoom $room): JsonResponse
    {
        return response()->json(['data' => $room]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'number' => ['required', 'string', 'max:20', 'unique:hotel_rooms,number'],
            'type' => ['required', 'string', 'max:100'],
            'rate' => ['required', 'numeric', 'gt:0'],
            'status' => ['sometimes', 'in:Available,Occupied,Cleaning'],
            'floor' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $room = HotelRoom::create($validated + ['status' => 'Available']);

        return response()->json(['data' => $room], 201);
    }
}
