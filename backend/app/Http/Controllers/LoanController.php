<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoanRequest;
use App\Http\Requests\ReturnLoanRequest;
use App\Http\Resources\LoanResource;
use App\Models\ActivityLog;
use App\Models\Division;
use App\Models\Equipment;
use App\Models\Loan;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoanController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return LoanResource::collection(Loan::query()->with(['division', 'items.equipment'])->latest('borrowed_at')->paginate(20));
    }

    public function store(LoanRequest $request): LoanResource
    {
        $data = $request->validated();
        $loan = DB::transaction(function () use ($data): Loan {
            $loan = Loan::create([
                'code' => 'LOAN-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'borrower_name' => $data['borrowerName'],
                'division_id' => Division::firstOrCreate(['name' => $data['division']])->id,
                'purpose' => $data['purpose'],
                'borrowed_at' => $data['borrowedAt'],
                'due_at' => $data['dueAt'],
                'status' => 'borrowed',
                'notes' => $data['notes'] ?? null,
                'created_by' => auth()->id(),
            ]);

            foreach ($data['items'] as $item) {
                $equipment = Equipment::query()->lockForUpdate()->findOrFail($item['equipmentId']);
                if (! $equipment->active || $equipment->availableQuantity() < $item['quantity']) {
                    throw ValidationException::withMessages(['items' => "Stok {$equipment->name} tidak mencukupi."]);
                }

                $loan->items()->create(['equipment_id' => $equipment->id, 'quantity' => $item['quantity'], 'condition_out' => $item['conditionOut']]);
                $equipment->increment('quantity_in_use', $item['quantity']);
                $equipment->update(['availability_status' => 'in_use']);
            }

            ActivityLog::create(['user_id' => auth()->id(), 'action' => 'loan.created', 'subject_type' => Loan::class, 'subject_id' => $loan->id, 'description' => "Peminjaman {$loan->code} dibuat untuk {$loan->borrower_name}."]);

            return $loan;
        });

        return new LoanResource($loan->load(['division', 'items.equipment']));
    }

    public function show(Loan $loan): LoanResource
    {
        return new LoanResource($loan->load(['division', 'items.equipment']));
    }

    public function processReturn(ReturnLoanRequest $request, Loan $loan): LoanResource
    {
        $data = $request->validated();
        DB::transaction(function () use ($data, $loan): void {
            foreach ($data['items'] as $returned) {
                $item = $loan->items()->lockForUpdate()->findOrFail($returned['id']);
                if ($returned['quantity'] > $item->quantity - $item->returned_quantity) {
                    throw ValidationException::withMessages(['items' => 'Jumlah pengembalian melebihi jumlah yang dipinjam.']);
                }

                $equipment = Equipment::query()->lockForUpdate()->findOrFail($item->equipment_id);
                $item->increment('returned_quantity', $returned['quantity']);
                $item->update(['condition_in' => $returned['conditionIn'], 'notes' => $returned['notes'] ?? $item->notes]);
                $equipment->decrement('quantity_in_use', $returned['quantity']);
                if ($returned['conditionIn'] === 'damaged') {
                    $equipment->increment('quantity_damaged', $returned['quantity']);
                } elseif ($returned['conditionIn'] !== 'good') {
                    $equipment->increment('quantity_repair', $returned['quantity']);
                }

                $equipment->refresh()->update(['availability_status' => $equipment->quantity_in_use > 0 ? 'in_use' : (($equipment->quantity_damaged + $equipment->quantity_repair) > 0 ? 'inspection' : 'available')]);
            }

            $complete = $loan->items()->whereColumn('returned_quantity', '<', 'quantity')->doesntExist();
            $loan->update(['status' => $complete ? 'returned' : 'partially_returned', 'returned_at' => $complete ? $data['returnedAt'] : null]);
            ActivityLog::create(['user_id' => auth()->id(), 'action' => 'loan.returned', 'subject_type' => Loan::class, 'subject_id' => $loan->id, 'description' => "Pengembalian {$loan->code} diproses."]);
        });

        return new LoanResource($loan->fresh()->load(['division', 'items.equipment']));
    }
}
