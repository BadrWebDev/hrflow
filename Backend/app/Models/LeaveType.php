<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveType extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'default_quota', 'max_consecutive_days'];

    // Relationships
    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }
}
