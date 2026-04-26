<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_id',
        'full_name',
        'address',
        'contact',
        'certificate_type',
        'purpose',
        'status',
    ];
}
