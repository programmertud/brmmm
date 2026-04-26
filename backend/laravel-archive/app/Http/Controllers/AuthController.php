<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $request->input('username'),
            'username' => $request->input('username'),
            'email'    => $request->input('username').'@example.com',
            'password' => Hash::make($request->input('password')),
            'role'     => 'secretary',
        ]);

        return response()->json([
            'username' => $user->username,
            'role'     => $user->role,
        ], 201);
    }

    public function registerAdmin(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        if (User::where('role', 'admin')->exists()) {
            return response()->json([
                'message' => 'Admin account already exists.',
            ], 400);
        }

        $user = User::create([
            'name'     => $request->input('username'),
            'username' => $request->input('username'),
            'email'    => $request->input('username').'@example.com',
            'password' => Hash::make($request->input('password')),
            'role'     => 'admin',
        ]);

        return response()->json([
            'username' => $user->username,
            'role'     => $user->role,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $credentials['username'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        return response()->json([
            'username' => $user->username,
            'role'     => $user->role,
        ]);
    }
}
