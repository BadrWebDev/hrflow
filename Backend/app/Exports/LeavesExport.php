<?php

namespace App\Exports;

use App\Models\Leave;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class LeavesExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function collection()
    {
        $query = Leave::with(['user', 'leaveType', 'approver']);

        if ($this->startDate) {
            $query->where('start_date', '>=', $this->startDate);
        }

        if ($this->endDate) {
            $query->where('end_date', '<=', $this->endDate);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Employee',
            'Leave Type',
            'Start Date',
            'End Date',
            'Days',
            'Reason',
            'Status',
            'Approved By',
            'Created At',
        ];
    }

    public function map($leave): array
    {
        return [
            $leave->id,
            $leave->user->name,
            $leave->leaveType->name,
            $leave->start_date,
            $leave->end_date,
            $leave->days,
            $leave->reason ?? 'N/A',
            ucfirst($leave->status),
            $leave->approver?->name ?? 'Pending',
            $leave->created_at->format('Y-m-d H:i'),
        ];
    }
}
