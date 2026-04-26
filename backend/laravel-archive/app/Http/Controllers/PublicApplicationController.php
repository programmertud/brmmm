<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;

class PublicApplicationController extends Controller
{
    public function index()
    {
        $applications = Application::orderByDesc('created_at')->get()->map(function ($app) {
            return [
                'id'              => $app->reference_id,
                'fullName'        => $app->full_name,
                'address'         => $app->address,
                'contact'         => $app->contact,
                'certificateType' => $app->certificate_type,
                'purpose'         => $app->purpose,
                'status'          => $app->status,
                'date'            => $app->created_at?->format('m/d/Y'),
                'time'            => $app->created_at?->format('h:i A'),
            ];
        });

        return response()->json($applications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'        => 'required|string|max:255',
            'address'          => 'required|string|max:255',
            'contact'          => 'required|string|max:50',
            'certificate_type' => 'required|string|max:255',
            'purpose'          => 'required|string',
        ]);

        $now   = now();
        $year  = $now->year;
        $month = str_pad($now->month, 2, '0', STR_PAD_LEFT);
        $random = str_pad((string) random_int(1, 99999), 5, '0', STR_PAD_LEFT);

        $referenceId = "BR-{$year}-{$month}-{$random}";

        $application = Application::create([
            'reference_id'     => $referenceId,
            'full_name'        => $validated['full_name'],
            'address'          => $validated['address'],
            'contact'          => $validated['contact'],
            'certificate_type' => $validated['certificate_type'],
            'purpose'          => $validated['purpose'],
            'status'           => 'Pending',
        ]);

        return response()->json([
            'message'      => 'Application submitted successfully.',
            'reference_id' => $application->reference_id,
        ], 201);
    }

    public function show(string $referenceId)
    {
        $application = Application::where('reference_id', $referenceId)->first();

        if (! $application) {
            return response()->json([
                'status' => 'Not Found',
            ], 404);
        }

        return response()->json([
            'status'          => $application->status,
            'id'              => $application->reference_id,
            'fullName'        => $application->full_name,
            'address'         => $application->address,
            'contact'         => $application->contact,
            'certificateType' => $application->certificate_type,
            'purpose'         => $application->purpose,
            'date'            => $application->created_at?->format('Y-m-d'),
            'time'            => $application->created_at?->format('H:i'),
        ]);
    }

    public function updateStatus(string $referenceId, Request $request)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Approved,Rejected',
        ]);

        $application = Application::where('reference_id', $referenceId)->firstOrFail();
        $application->status = $request->input('status');
        $application->save();

        return response()->json(['message' => 'Status updated']);
    }

    public function destroy(string $referenceId)
    {
        $application = Application::where('reference_id', $referenceId)->firstOrFail();
        $application->delete();

        return response()->json(['message' => 'Application deleted']);
    }
}
