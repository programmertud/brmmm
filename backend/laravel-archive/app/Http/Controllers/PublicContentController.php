<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\Announcement;
use Carbon\Carbon;

class PublicContentController extends Controller
{
    public function storeComplaint(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $complaint = Complaint::create([
            'name'    => $data['name'],
            'contact' => $data['contact'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            'status'  => 'Received',
        ]);

        return response()->json([
            'message' => 'Complaint submitted successfully.',
            'id'      => $complaint->id,
        ], 201);
    }

    public function listComplaints()
    {
        $items = Complaint::orderByDesc('created_at')->get()->map(function ($c) {
            return [
                'id'         => $c->id,
                'name'       => $c->name,
                'contact'    => $c->contact,
                'subject'    => $c->subject,
                'message'    => $c->message,
                'status'     => $c->status,
                'created_at' => $c->created_at?->format('Y-m-d H:i'),
            ];
        });

        return response()->json($items);
    }

    public function listAnnouncements()
    {
        $items = Announcement::orderByDesc('date')->get()->map(function ($a) {
            return [
                'title' => $a->title,
                'date'  => $a->date?->format('F d, Y'),
                'desc'  => $a->body,
            ];
        });

        return response()->json($items);
    }

    public function storeAnnouncement(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'body'  => 'required|string',
        ]);

        // Allow date to be optional; if not provided or invalid, use current date/time
        $dateInput = $request->input('date');
        $date = null;
        if ($dateInput) {
            try {
                $date = Carbon::parse($dateInput);
            } catch (\Exception $e) {
                $date = now();
            }
        } else {
            $date = now();
        }

        $announcement = Announcement::create([
            'title' => $data['title'],
            'body'  => $data['body'],
            'date'  => $date,
        ]);

        return response()->json([
            'message' => 'Announcement created successfully.',
            'id'      => $announcement->id,
        ], 201);
    }
}
