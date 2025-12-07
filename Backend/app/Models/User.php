<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'department_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

    public function approvedLeaves()
    {
        return $this->hasMany(Leave::class, 'approver_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Check if user has a specific permission (bypasses Spatie to avoid morph map issues)
     */
    public function hasPermissionTo($permission): bool
    {
        // Get user's role IDs
        $roleIds = \DB::table('model_has_roles')
            ->where('model_type', 'App\\Models\\User')
            ->where('model_id', $this->id)
            ->pluck('role_id');

        if ($roleIds->isEmpty()) {
            return false;
        }

        // Check if any of the user's roles have this permission
        $hasPermission = \DB::table('role_has_permissions')
            ->join('permissions', 'role_has_permissions.permission_id', '=', 'permissions.id')
            ->whereIn('role_has_permissions.role_id', $roleIds)
            ->where('permissions.name', $permission)
            ->exists();

        return $hasPermission;
    }

    /**
     * Check if user has a specific role (bypasses Spatie to avoid morph map issues)
     */
    public function hasRole($role): bool
    {
        return \DB::table('model_has_roles')
            ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
            ->where('model_has_roles.model_type', 'App\\Models\\User')
            ->where('model_has_roles.model_id', $this->id)
            ->where('roles.name', $role)
            ->exists();
    }
}
