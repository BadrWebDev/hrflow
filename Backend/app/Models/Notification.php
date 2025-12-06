<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'data',
        'read_at',
        'email_sent',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'email_sent' => 'boolean',
    ];

    // Relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Check if notification is read
    public function isRead()
    {
        return !is_null($this->read_at);
    }

    // Mark as read
    public function markAsRead()
    {
        $this->read_at = now();
        $this->save();
    }
}
